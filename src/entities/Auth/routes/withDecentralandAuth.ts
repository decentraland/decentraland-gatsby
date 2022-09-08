import {
  DecentralandSignatureData,
  VerifyAuthChainHeadersOptions,
} from 'decentraland-crypto-middleware/lib/types'
import verify from 'decentraland-crypto-middleware/lib/verify'

import logger from '../../Development/logger'
import Context from '../../Route/wkc/context/Context'
import ErrorResponse from '../../Route/wkc/response/ErrorResponse'
import Router from '../../Route/wkc/routes/Router'
import { WithAuth } from '../types'

export type WithDecentralandAuthOptions = VerifyAuthChainHeadersOptions & {
  optional?: boolean
}

export type WithDecentralandAuthHandler<D> = (
  ctx: Context<{}> | Pick<WithAuth, 'auth' | 'authMetadata' | 'app'>
) => Promise<D>

export function withDecentralandAuth(
  options?: { optional?: false } & VerifyAuthChainHeadersOptions
): WithDecentralandAuthHandler<DecentralandSignatureData>
export function withDecentralandAuth(
  options: { optional: true } & VerifyAuthChainHeadersOptions
): WithDecentralandAuthHandler<DecentralandSignatureData | null>
export function withDecentralandAuth(
  options: WithDecentralandAuthOptions = {}
) {
  return Router.memo(
    async (
      ctx: Context<{}> | Pick<WithAuth, 'auth' | 'authMetadata' | 'app'>
    ) => {
      const req = ctx as Partial<DecentralandSignatureData>
      if (req.auth) {
        return { auth: req.auth!, authMetadata: req.authMetadata! }
      }

      const context = ctx as Context<{}>
      try {
        const data = await verify(
          context.method,
          context.baseUrl + context.path,
          context.headers,
          options
        )
        return data
      } catch (err) {
        if (err.statusCode === 401) {
          logger.error(err.message, {
            ...err,
            stack: err.stack,
            method: context.method,
            path: context.baseUrl + context.path,
            headers: context.headers,
          })
        }

        if (err.statusCode === 400 || !options.optional) {
          throw new ErrorResponse(err.statusCode, err.message)
        }

        return null
      }
    }
  )
}

export default withDecentralandAuth
export const withAuth = withDecentralandAuth()
export const withAuthOptional = withDecentralandAuth({ optional: true })
