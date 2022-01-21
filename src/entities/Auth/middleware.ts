import { NextFunction, Request, Response } from 'express'
import verify from 'decentraland-crypto-middleware/lib/verify'
import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { AuthIdentity, AuthChain, AuthLinkType } from 'dcl-crypto/dist/types'
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
} from '../../utils/api/API.types'
import { getProvider } from '../Blockchain/provider'

export type WithAuth<R extends Request = Request> = R & {
  auth: string | undefined
  authMetadata: Record<string, string | number> | undefined
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

export function withChainHeader(options: AuthOptions = {}) {
  return middleware(async (req: Request) => {
    try {
      const data = await verify(req.method, req.baseUrl + req.path, req.headers)
      Object.assign(req, data)
    } catch (err) {
      if (err.statusCode === 400 || !options.optional) {
        throw new RequestError(err.message, err.statusCode)
      }
    }
  })
}

export function auth(options: AuthOptions = {}) {
  const checkAuthorizationHeader = withAuthorizationHeader(options)
  const checkChainHeader = withChainHeader(options)
  const checkOptional = middleware(async () => {
    if (!options.optional) {
      throw new RequestError(`Unauthorized`, RequestError.Unauthorized)
    }
  })

  return async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header(AUTHORIZATION_HEADER)
    if (authorization) {
      return checkAuthorizationHeader(req, res, next)
    }

    const chain = req.header(AUTH_CHAIN_HEADER_PREFIX + '0')
    if (chain) {
      return checkChainHeader(req, res, next)
    }

    return checkOptional(req, res, next)
  }
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
