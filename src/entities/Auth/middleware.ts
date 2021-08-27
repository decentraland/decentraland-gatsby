import { Request } from 'express'
import { getConfiguration } from 'decentraland-connect/dist/configuration'
import { AuthIdentity, AuthChain, AuthLinkType } from 'dcl-crypto/dist/types'
import { Authenticator, parseEmphemeralPayload } from 'dcl-crypto/dist/Authenticator'
import { fromBase64 } from '../../utils/string/base64'
import { HttpProvider } from 'web3x/providers'
import RequestError from '../Route/error'
import { middleware } from '../Route/handle'
import logger from '../Development/logger'
import once from '../../utils/function/once'
import { ChainId } from '../../utils/loader/ensBalance'

export type WithAuth<R extends Request = Request> = R & {
  auth: string | null
}

export type AuthOptions = {
  optional?: boolean
  allowInvalid?: boolean
}

const getProvider = once(() => {
  const configuration = getConfiguration()
  const provider = new HttpProvider(configuration.wallet_connect.urls[ChainId.ETHEREUM_MAINNET])
  return provider
})

export function auth(options: AuthOptions = {}) {
  return middleware(async (req) => {
    const authorization = req.header('authorization')
    if (!authorization && options.optional) {
      return
    } else if (!authorization) {
      throw new RequestError(`Unauthorized`, RequestError.Unauthorized)
    }

    const [type, token] = authorization.split(' ')
    if (type.toLowerCase() !== 'bearer' && options.allowInvalid) {
      return
    } else if (type.toLowerCase() !== 'bearer') {
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
      if (options.allowInvalid) {
        return
      } else {
        throw new RequestError(
          `Invalid authorization token`,
          RequestError.Unauthorized
        )
      }
    }

    let result: { ok: boolean; message?: string } = { ok: false }
    try {
      result = await Authenticator.validateSignature(ephemeralAddress, authChain, getProvider())
    } catch (error) {
      logger.error(error)
      if (options.allowInvalid) {
        return
      } else {
        throw new RequestError(
          `Invalid authorization token sign`,
          RequestError.Unauthorized
        )
      }
    }

    if (!result.ok && options.allowInvalid) {
      return
    } else if (!result.ok) {
      throw new RequestError(
        result.message || 'Invalid authorization data',
        RequestError.Forbidden
      )
    }

    const auth = Authenticator.ownerAddress(authChain).toLowerCase()
    Object.assign(req, { auth })
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
