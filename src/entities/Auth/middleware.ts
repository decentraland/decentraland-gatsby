import { Request } from 'express'
import { Authenticator, AuthLinkType, AuthIdentity, AuthChain } from 'dcl-crypto'
import { fromBase64 } from '../../utils/base64'
import { HttpProvider } from 'web3x/providers'
import RequestError from '../Route/error'
import { middleware } from '../Route/handle'

export type WithAuth<R extends Request = Request> = R & {
  auth: string | null
}

export type AuthOptions = {
  optional?: boolean,
  allowInvalid?: boolean
}

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
      throw new RequestError(`Invalid authorization type: "${type}"`, RequestError.Unauthorized)
    }

    let identity: AuthIdentity
    try {
      const data = fromBase64(token)
      identity = JSON.parse(data) as AuthIdentity
    } catch (error) {
      console.log(error)

      if (options.allowInvalid) {
        return
      } else {
        throw new RequestError(`Invalid authorization token`, RequestError.Unauthorized)
      }
    }

    const result = await await Authenticator.validateSignature(
      identity.ephemeralIdentity.address,
      identity.authChain,
      new HttpProvider('https://mainnet.infura.io/v3/640777fe168f4b0091c93726b4f0463a')
    )

    if (!result.ok && options.allowInvalid) {
      return
    } else if (!result.ok) {
      throw new RequestError(result.message || 'Invalid authorization data', RequestError.Forbidden)
    }

    const auth = getPayload(identity.authChain, AuthLinkType.SIGNER)
    Object.assign(req, { auth })
  })
}

function getPayload(authChain: AuthChain, type: AuthLinkType) {
  for (const chain of authChain) {
    if (chain.type === type) {
      return chain.payload.toLowerCase()
    }
  }

  return null
}
