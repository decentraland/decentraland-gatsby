import Context from '../../Route/wkc/context/Context'
import ErrorResponse from '../../Route/wkc/response/ErrorResponse'
import Response from '../../Route/wkc/response/Response'
import Router from '../../Route/wkc/routes/Router'

export type WithBearerTokenOptions = {
  tokens?: string[]
  optional?: boolean
}

/**
 * Creates a request handler that will fails if the request dosn't have
 * a bearer token that match one of the tokens received as param
 */
function withBearerToken(options?: {
  optional?: false
  tokens?: string[]
}): (ctx: Pick<Context, 'request'>) => Promise<string>
function withBearerToken(options?: {
  optional: true
  tokens?: string[]
}): (ctx: Pick<Context, 'request'>) => Promise<string | null>
function withBearerToken(
  options?: WithBearerTokenOptions
): (ctx: Pick<Context, 'request'>) => Promise<string | null>
function withBearerToken(options: WithBearerTokenOptions = {}) {
  return Router.memo(async function (ctx: Pick<Context, 'request'>) {
    if (!options.tokens || options.tokens.length === 0) {
      if (options.optional) {
        return null
      }

      throw new ErrorResponse(Response.Unauthorized, 'Invalid Bearer Token')
    }

    const authorization = ctx.request.headers.get('authorization')
    if (!authorization) {
      if (options.optional) {
        return null
      }

      throw new ErrorResponse(Response.Unauthorized, 'Missing Authorization')
    }

    if (!authorization.startsWith('Bearer ')) {
      if (options.optional) {
        return null
      }

      throw new ErrorResponse(Response.BadRequest, `Invalid Authorization`)
    }

    const auth = authorization.slice('Bearer '.length).trim()
    if (!options.tokens.includes(auth)) {
      if (options.optional) {
        return null
      }

      throw new ErrorResponse(Response.Forbidden, 'Invalid Bearer Token')
    }

    return auth
  })
}

export default withBearerToken
