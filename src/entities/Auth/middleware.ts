import {
  AUTH_CHAIN_HEADER_PREFIX,
  VerifyAuthChainHeadersOptions,
} from 'decentraland-crypto-middleware/lib/types'
import verify from 'decentraland-crypto-middleware/lib/verify'
import { NextFunction, Request, Response } from 'express'

import { AuthData, WithAuth } from './types'
import { verifySigner } from './utils'
import logger from '../Development/logger'
import RequestError from '../Route/error'
import middleware from '../Route/handle/middleware'

export { AuthData, WithAuth }

export type AuthOptions = {
  optional?: boolean
}

export function withChainHeader(
  options: AuthOptions & VerifyAuthChainHeadersOptions = {}
) {
  return middleware(
    async (req: Pick<Request, 'method' | 'baseUrl' | 'path' | 'headers'>) => {
      try {
        const data = await verify<Record<string, string>>(
          req.method,
          req.baseUrl + req.path,
          req.headers,
          {
            verifyMetadataContent: verifySigner,
            ...options,
          }
        )

        Object.assign(req, data)
      } catch (err) {
        if (err.statusCode === 401) {
          logger.error(err.message, {
            ...err,
            stack: err.stack,
            method: req.method,
            path: req.baseUrl + req.path,
            headers: req.headers,
          })
        }
        if (err.statusCode === 400 || !options.optional) {
          throw new RequestError(err.message, err.statusCode)
        }
      }
    }
  )
}

export function auth(
  options: AuthOptions & VerifyAuthChainHeadersOptions = {}
) {
  const checkChainHeader = withChainHeader(options)
  const checkOptional = middleware(async () => {
    if (!options.optional) {
      throw new RequestError(`Unauthorized`, RequestError.Unauthorized)
    }
  })

  return async (req: Request, res: Response, next: NextFunction) => {
    const chain = req.headers[AUTH_CHAIN_HEADER_PREFIX + '0']
    if (chain) {
      return checkChainHeader(req, res, next)
    }

    return checkOptional(req, res, next)
  }
}

/** @deprecated */
export function withBearerToken(tokens: string[]) {
  return middleware(async (req: Pick<Request, 'headers'>) => {
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
