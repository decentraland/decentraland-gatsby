import type { IHttpServerComponent } from '@well-known-components/interfaces/dist/components/http-server'
import type { Query } from 'express-serve-static-core'
import type { IncomingHttpHeaders } from 'http'

export default class Context<P extends {} = {}> {
  url: URL

  request: IHttpServerComponent.IRequest

  params: P

  routePath: string

  /**
   * @deprecated use ctx.request.method
   */
  method: IHttpServerComponent.HTTPMethod

  /**
   * @deprecated use ctx.request.headers
   */
  headers: IncomingHttpHeaders

  /**
   * @deprecated use ctx.url.searchParams
   */
  query: Query

  /**
   * @deprecated use ctx.url
   * @example `http` | `https`
   */
  protocol: string

  /**
   * @deprecated use ctx.url
   * @example `example.com:3000`
   */
  hostname: string

  /**
   * @deprecated use ctx.url
   * @example `/admin/new?sort=desc`
   */
  originalUrl: string

  /**
   * @deprecated use ctx.url
   * @example `/admin`
   */
  baseUrl: string

  /**
   * @deprecated use ctx.url
   * @example `/new`
   */
  path: string

  /**
   * @deprecated use ctx.request.[json|text|formData]()
   */
  body?: any

  // static from
}