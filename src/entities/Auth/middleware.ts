import { Request } from 'express'
import { ChainId } from '@dcl/schemas'
import {
  AuthIdentity,
  AuthChain,
  AuthLinkType,
  AuthLink,
} from 'dcl-crypto/dist/types'
import {
  Authenticator,
  parseEmphemeralPayload,
} from 'dcl-crypto/dist/Authenticator'
import { fromBase64 } from '../../utils/string/base64'
import RequestError from '../Route/error'
import { middleware } from '../Route/handle'
import logger from '../Development/logger'
import {
  AUTHORIZATION_HEADER,
  AUTH_CHAIN_HEADER_PREFIX,
  AUTH_METADATA_HEADER,
  AUTH_TIMESTAMP_HEADER,
} from '../../utils/api/API.types'
import Time from '../../utils/date/Time'
import { getProvider } from '../Blockchain/provider'

export type WithAuth<R extends Request = Request> = R & {
  auth: string | null
  authMetadata: Record<string, string | number> | null
}

export type AuthOptions = {
  optional?: boolean
}

function checkAuthorizationHeader(options: AuthOptions = {}) {
  return async function (req: Request) {
    const authorization = req.header('authorization')
    if (!authorization && options.optional) {
      return
    } else if (!authorization) {
      throw new RequestError(`Unauthorized`, RequestError.Unauthorized)
    }

    const [type, token] = authorization.split(' ')
    if (type.toLowerCase() !== 'bearer') {
      throw new RequestError(
        `Invalid authorization type: "${type}"`,
        RequestError.Unauthorized
      )
    }

    // let identity: AuthIdentity
    let ephemeralAddress: string
    let authChain: AuthChain
    try {
      const data = fromBase64(token)
      const identity = JSON.parse(data) as AuthIdentity | AuthChain
      authChain = Array.isArray(identity) ? identity : identity.authChain
      const ephemeralPayloadLink = authChain.find((link) =>
        [
          AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
          AuthLinkType.ECDSA_EIP_1654_EPHEMERAL,
        ].includes(link.type)
      )
      const ephemeralPayload = parseEmphemeralPayload(
        (ephemeralPayloadLink && ephemeralPayloadLink.payload) || ''
      )
      ephemeralAddress = ephemeralPayload.ephemeralAddress
    } catch (error) {
      logger.error(`Error decoding authChain`, error)
      throw new RequestError(
        `Invalid authorization token`,
        RequestError.Unauthorized
      )
    }

    let result: { ok: boolean; message?: string } = { ok: false }
    try {
      result = await Authenticator.validateSignature(
        ephemeralAddress,
        authChain,
        getProvider({ chainId: ChainId.ETHEREUM_MAINNET })
      )
    } catch (error) {
      logger.error(error)
      throw new RequestError(
        `Invalid authorization token sign`,
        RequestError.Unauthorized
      )
    }

    if (!result.ok) {
      throw new RequestError(
        result.message || 'Invalid authorization data',
        RequestError.Forbidden
      )
    }

    const auth = Authenticator.ownerAddress(authChain).toLowerCase()
    Object.assign(req, { auth, authMetadata: null })
  }
}

export function withAuthorizationHeader(options: AuthOptions = {}) {
  return middleware(checkAuthorizationHeader(options))
}

function checkChainHeader(options: AuthOptions = {}) {
  return async function (req: Request) {
    let i = 0
    const authChain: AuthLink[] = []
    while (req.header(AUTH_CHAIN_HEADER_PREFIX + i)) {
      const data = req.header(AUTH_CHAIN_HEADER_PREFIX + i)!
      authChain.push(JSON.parse(data))
      i++
    }

    if (authChain.length === 0 && options.optional) {
      return
    } else if (authChain.length === 0) {
      throw new RequestError(`Unauthorized`, RequestError.Unauthorized)
    }

    const method = req.method
    const path = req.baseUrl + req.path
    const rawTimestamp = req.header(AUTH_TIMESTAMP_HEADER) || '0'
    const rawMetadata = req.header(AUTH_METADATA_HEADER) || '{}'
    const ownerAddress = Authenticator.ownerAddress(authChain).toLowerCase()
    const payload = [method, path, rawTimestamp, rawMetadata]
      .join(':')
      .toLowerCase()

    const verification = await Authenticator.validateSignature(
      payload,
      authChain,
      getProvider({ chainId: ChainId.ETHEREUM_MAINNET })
    )
    if (!verification.ok) {
      throw new RequestError(
        `Invalid signature: ${verification}`,
        RequestError.Forbidden
      )
    }

    const timestamp = Number(rawTimestamp)
    const metadata = JSON.parse(rawTimestamp)
    if (timestamp + Time.Minute < Date.now()) {
      throw new RequestError('Expired signature', RequestError.Forbidden)
    }

    Object.assign(req, {
      auth: ownerAddress,
      authMetadata: metadata,
    })
  }
}

export function withChainHeader(options: AuthOptions = {}) {
  return middleware(checkChainHeader(options))
}

export function auth(options: AuthOptions = {}) {
  return middleware(async (req: Request) => {
    const authorization = req.header(AUTHORIZATION_HEADER)
    if (authorization) {
      return checkAuthorizationHeader(options)(req)
    }

    const chain = req.header(AUTH_CHAIN_HEADER_PREFIX + '0')
    if (chain) {
      return checkChainHeader(options)(req)
    }

    if (!options.optional) {
      throw new RequestError(`Unauthorized`, RequestError.Unauthorized)
    }
  })
}

export function withBearerToken(tokens: string[]) {
  return middleware(async (req: Request) => {
    const authorization = req.headers.authorization
    if (!authorization) {
      throw new RequestError('Missing Authorization', RequestError.Unauthorized)
    }

    if (!authorization.startsWith('Bearer ')) {
      throw new RequestError(`Ivalid Authorization`, RequestError.BadRequest)
    }

    const auth = authorization.slice('Bearer '.length)
    if (!tokens.includes(auth)) {
      throw new RequestError('Unauthorized', RequestError.Unauthorized)
    }

    Object.assign(req, { auth: auth.slice(0, 10) })
  })
}
