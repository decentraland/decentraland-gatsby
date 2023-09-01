import { Logger } from '../../../Development/logger'

import type { IHttpServerComponent } from '@well-known-components/interfaces/dist/components/http-server'
import type { Query } from 'express-serve-static-core'
import type { IncomingHttpHeaders } from 'http'

export class FullContext<P extends Record<string, string> = {}> {
  url: URL

  request: IHttpServerComponent.IRequest

  params: P

  routePath: string

  logger: Logger

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

type Context<
  P extends Record<string, string> = {},
  K extends keyof FullContext = keyof FullContext
> = Pick<FullContext<P>, K>

export default Context
