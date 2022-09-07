import {
  DecentralandSignatureData,
  VerifyAuthChainHeadersOptions,
} from 'decentraland-crypto-middleware/lib/types'
import verify from 'decentraland-crypto-middleware/lib/verify'

import logger from '../../Development/logger'
import ErrorResponse from '../../Route/wkc/response/ErrorResponse'
import Router, { SimpleHandler } from '../../Route/wkc/routes/Router'

export type WithDecentralandAuthOptions = VerifyAuthChainHeadersOptions & {
  optional?: boolean
}

export function withDecentralandAuth(
  options?: { optional?: false } & VerifyAuthChainHeadersOptions
): SimpleHandler<{}, DecentralandSignatureData>
export function withDecentralandAuth(
  options: { optional: true } & VerifyAuthChainHeadersOptions
): SimpleHandler<{}, DecentralandSignatureData | null>
export function withDecentralandAuth(
  options: WithDecentralandAuthOptions = {}
) {
  return Router.memo(async (ctx) => {
    try {
      const data = await verify(
        ctx.method,
        ctx.baseUrl + ctx.path,
        ctx.headers,
        options
      )
      return data
    } catch (err) {
      if (err.statusCode === 401) {
        logger.error(err.message, {
          ...err,
          stack: err.stack,
          method: ctx.method,
          path: ctx.baseUrl + ctx.path,
          headers: ctx.headers,
        })
      }

      if (err.statusCode === 400 || !options.optional) {
        throw new ErrorResponse(err.statusCode, err.message)
      }

      return null
    }
  })
}

export default withDecentralandAuth
export const withAuth = withDecentralandAuth()
export const withAuthOptional = withDecentralandAuth({ optional: true })
