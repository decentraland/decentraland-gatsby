import * as express from 'express'
import { memo } from 'radash'

import defaultAjv from '../../../Schema/index'
import Context from '../context/Context'
import ErrorResponse from '../response/ErrorResponse'
import Response from '../response/Response'
import { route } from './utils'

import type { IMiddlewareAdapterHandler } from '@well-known-components/interfaces/dist/components/base-component'
import type { IHttpServerComponent } from '@well-known-components/interfaces/dist/components/http-server'
import type { default as Ajv, JSONSchemaType } from 'ajv'

export { JSONSchemaType }

export type MomorizableHandler = (
  ctx: Context<any>,
  ...args: any[]
) => Promise<any>
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
  static validator<Result = any>(
    schema: JSONSchemaType<Result>,
    ajv: Ajv = defaultAjv
  ) {
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
  static memo<H extends MomorizableHandler>(handle: H): H {
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

  #add<Path extends string>(
    method:
      | 'all'
      | 'get'
      | 'post'
      | 'put'
      | 'delete'
      | 'patch'
      | 'options'
      | 'head'
      | 'connect'
      | 'trace',
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    if (typeof handler !== 'function') {
      throw new Error(
        `Handler for ${method} ${path} is not a function (is a ${typeof handler})`
      )
    }

    this.#router[method](path, route(handler))
    return this
  }

  all<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    return this.#add('all', path, handler)
  }
  get<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    return this.#add('get', path, handler)
  }
  post<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    return this.#add('post', path, handler)
  }
  put<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    return this.#add('put', path, handler)
  }
  delete<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    return this.#add('delete', path, handler)
  }
  patch<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    return this.#add('patch', path, handler)
  }
  options<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    return this.#add('options', path, handler)
  }
  head<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    return this.#add('head', path, handler)
  }
  connect<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    return this.#add('connect', path, handler)
  }
  trace<Path extends string>(
    path: Path,
    handler: Handler<IHttpServerComponent.ParseUrlParams<Path>>
  ) {
    return this.#add('trace', path, handler)
  }

  getRouter() {
    return this.#router
  }
}
