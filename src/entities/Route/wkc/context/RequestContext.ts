import { FullContext } from './Context'
import logger from '../../../Development/logger'
import { Request, RequestInit } from '../request/Request'

export type RequestContextInit = Omit<RequestInit, 'headers'> & {
  // query?: URLSearchParams | string | Record<string, string | ReadonlyArray<string>> | Iterable<[string, string]> | ReadonlyArray<[string, string]>
  query?: URLSearchParams | string | Record<string, string> | [string, string][]
}

export default class RequestContext<
  Params extends Record<string, string> = {}
> extends FullContext<Params> {
  constructor(params: Params, init: RequestContextInit = {}) {
    super()
    this.params = params
    const pathname = Object.keys(params).reduce(
      (prev, key) => prev + `/${key}/${params[key]}`,
      ''
    )
    const searchParams = new URLSearchParams(init.query)
    const query = searchParams.toString()
    const originalUrl = pathname + (query ? '?' : '') + query
    this.url = new URL(originalUrl, 'https://dcl.eth')
    this.request = new Request(this.url.toString(), init)
    this.routePath = pathname
    this.logger = logger.extend({
      url_params: this.params,
      http_handler: this.routePath,
    })
    this.method = (init.method as any) || 'GET'
    this.headers = Object.fromEntries(this.request.headers.entries())
    this.query = Object.fromEntries(searchParams.entries())
    this.protocol = 'https'
    this.hostname = this.url.host
    this.originalUrl = originalUrl
    this.baseUrl = ''
    this.path = pathname
    this.body = init.body
  }
}
