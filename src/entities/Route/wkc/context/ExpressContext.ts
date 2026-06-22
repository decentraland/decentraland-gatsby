// `getRequestFromNodeMessage` is not re-exported from the @dcl/http-server
// package root yet, so it is imported from its published `dist/logic` entry.
// TODO: switch to a public root export once @dcl/http-server provides one.
import { getRequestFromNodeMessage } from '@dcl/http-server/dist/logic'

import { FullContext } from './Context'
import logger from '../../../Development/logger'

import type { IHttpServerComponent } from '@dcl/core-commons'
import type * as express from 'express'

export default class ExpressContext<P extends {} = {}> extends FullContext<P> {
  constructor(request: express.Request) {
    super()
    this.url = new URL(
      `${request.protocol}://${request.hostname}${request.originalUrl}`
    )
    this.request = getRequestFromNodeMessage(request, request.hostname)
    this.params = request.params as any
    this.routePath = request.baseUrl + (request.route?.path || '')
    this.logger = logger.extend({
      url_params: this.params,
      http_handler: this.routePath,
    })
    this.headers = request.headers
    this.method =
      request.method.toUpperCase() as IHttpServerComponent.HTTPMethod
    this.query = request.query
    this.protocol = request.protocol
    this.originalUrl = request.originalUrl
    this.baseUrl = request.baseUrl
    this.path = request.path
    this.hostname = request.hostname

    if (request.body !== undefined && request.body !== null) {
      this.body = request.body
    }
  }
}
