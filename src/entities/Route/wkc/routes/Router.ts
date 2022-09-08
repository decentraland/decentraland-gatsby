import Ajv, { JSONSchemaType } from 'ajv'
import * as express from 'express'
import { memo } from 'radash/dist/curry'

import defaultAjv from '../../../Schema/index'
import Context from '../context/Context'
import ErrorResponse from '../response/ErrorResponse'
import Response from '../response/Response'
import { route } from './utils'

import type { IMiddlewareAdapterHandler } from '@well-known-components/interfaces/dist/components/base-component'
import type { IHttpServerComponent } from '@well-known-components/interfaces/dist/components/http-server'

export type SimpleHandler<Params extends {} = {}, ReturnType = Response> = (
  ctx: Context<Params>
) => Promise<ReturnType>
export type Handler<
  Params extends {} = {},
  ReturnType = Response
> = IMiddlewareAdapterHandler<Context<Params>, ReturnType>

export type RouterOptions = express.RouterOptions

export default class Router {
  /**
   * Creates an ajv validator to that can be call inside a router
   * and will automatically exist the execution if fails
   */
  static validator<Result>(schema: JSONSchemaType<any>, ajv: Ajv = defaultAjv) {
    const getValidator = memo(() => ajv.compile(schema))
    return async function (data: any): Promise<Result> {
      const validator = getValidator()
      if (!validator(data) && validator.errors && validator.errors.length > 0) {
        const messages = validator.errors
          .map((error) => {
            let message = ''
            if (error.instancePath) {
              message += error.instancePath.slice(1)
            }

            if (error.message) {
              message += (message ? ' ' : '') + error.message
            }

            if (error.params) {
              message += (message ? ' ' : '') + JSON.stringify(error.params)
            }

            return message
          })
          .filter(Boolean)

        throw new ErrorResponse(
          Response.BadRequest,
          'Error validating input:\n- ' + messages.join('\n- '),
          {
            messages,
            body: data,
            errors: [...validator.errors],
          }
        )
      }

      return data as Result
    }
  }

  /**
   * Wrap a request handle with memo to get a function back that automagically
   * returns values that have already been calculated for the same request.
   */
  static memo<H extends Handler<{}, any> = Handler<{}, any>>(handle: H): H {
    const key = Symbol('@memo')
    return async function (
      ctx: Context & { [key]: Response },
      next: () => Promise<Response>
    ) {
      if (ctx[key]) {
        return ctx[key]
      }

      ctx[key] = await handle(ctx, next)
      return ctx[key]
    } as H
  }

  #router: express.Router

  constructor(options: express.RouterOptions = {}) {
    this.#router = express.Router(options)
  }

  all<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    this.#router.all(path, route(handler))
    return this
  }
  get<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    this.#router.get(path, route(handler))
    return this
  }
  post<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    this.#router.post(path, route(handler))
    return this
  }
  put<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    this.#router.put(path, route(handler))
    return this
  }
  delete<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    this.#router.delete(path, route(handler))
    return this
  }
  patch<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    this.#router.patch(path, route(handler))
    return this
  }
  options<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    this.#router.options(path, route(handler))
    return this
  }
  head<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    this.#router.head(path, route(handler))
    return this
  }
  connect<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    this.#router.connect(path, route(handler))
    return this
  }
  trace<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    this.#router.trace(path, route(handler))
    return this
  }

  getRouter() {
    return this.#router
  }
}
