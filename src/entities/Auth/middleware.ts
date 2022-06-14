import { AUTH_CHAIN_HEADER_PREFIX } from 'decentraland-crypto-middleware/lib/types'
import verify from 'decentraland-crypto-middleware/lib/verify'
import { NextFunction, Request, Response } from 'express'

import RequestError from '../Route/error'
import { middleware } from '../Route/handle'

export type AuthData = {
  auth: string | undefined
  authMetadata: Record<string, string | number> | undefined
}

export type AuthOptions = {
  optional?: boolean
}

export type WithAuth<R extends Request = Request> = R & AuthData

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
  const checkChainHeader = withChainHeader(options)
  const checkOptional = middleware(async () => {
    if (!options.optional) {
      throw new RequestError(`Unauthorized`, RequestError.Unauthorized)
    }
  })

  return async (req: Request, res: Response, next: NextFunction) => {
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
      throw new RequestError(`Invalid Authorization`, RequestError.BadRequest)
    }

    const auth = authorization.slice('Bearer '.length)
    if (!tokens.includes(auth)) {
      throw new RequestError('Unauthorized', RequestError.Unauthorized)
    }

    Object.assign(req, { auth: auth.slice(0, 10) })
  })
}
