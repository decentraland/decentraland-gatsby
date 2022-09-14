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

export type DecentralandAuthData = {
  address: string
  metadata: Record<string, any>
}

export type WithDecentralandAuthHandler<D> = (
  ctx: Context<{}, 'request'> | Pick<WithAuth, 'auth' | 'authMetadata' | 'app'>
) => Promise<D>

function withDecentralandAuth(
  options?: { optional?: false } & VerifyAuthChainHeadersOptions
): WithDecentralandAuthHandler<DecentralandAuthData>
function withDecentralandAuth(
  options: { optional: true } & VerifyAuthChainHeadersOptions
): WithDecentralandAuthHandler<DecentralandAuthData | null>
function withDecentralandAuth(options: WithDecentralandAuthOptions = {}) {
  return Router.memo(
    async (
      ctx:
        | Context<{}, 'request'>
        | Pick<WithAuth, 'auth' | 'authMetadata' | 'app'>
    ) => {
      const req = ctx as Partial<DecentralandSignatureData>
      if (req.auth) {
        return { address: req.auth!, metadata: req.authMetadata! }
      }

      const context = ctx as Context<{}, 'request'>
      const method = context.request.method
      const url = new URL(context.request.url, 'http://0.0.0.0/')
      const path = url.pathname
      const headers: Record<string, string> = {}
      context.request.headers.forEach((value, header) => {
        headers[header] = value
      })

      try {
        const data = await verify(method, path, headers, options)

        return {
          address: data.auth,
          metadata: data.authMetadata,
        }
      } catch (err) {
        if (err.statusCode === 401) {
          logger.error(err.message, {
            ...err,
            stack: err.stack,
            method,
            path,
            headers,
          })
        }

        if (!options.optional) {
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
