import { Request, Response } from 'express'

import RequestError from './error'

/** @deprecated */
export type ParamOptions<T> = {
  validator?: (value: any) => boolean
  parser?: (value: any) => T | null
  required?: boolean
  defaultValue?: T
}

/** @deprecated */
export default class Context {
  constructor(public readonly req: Request, public readonly res: Response) {}

  header(name: string, defaultValue: string | undefined = undefined) {
    return this.req.header(name) ?? defaultValue
  }

  value<T = string>(
    name: string,
    value: any,
    options: ParamOptions<T> = {}
  ): T | null {
    if (value === undefined || value === null) {
      if (options.required) {
        throw new RequestError(
          `Param ${name} is required`,
          RequestError.BadRequest
        )
      }

      return null
    }

    const finalValue: T = options.parser
      ? options.parser(value)
      : (value as any)

    if (options.validator && !options.validator(finalValue)) {
      if (options.required) {
        throw new RequestError(
          `Invalid param ${name}: "${value}"`,
          RequestError.BadRequest
        )
      }

      return null
    }

    return finalValue
  }

  param<T = string>(name: string, options: ParamOptions<T> = {}): T | null {
    const value =
      this.req.params[name] ?? this.req.body[name] ?? this.req.query[name]
    return this.value(name, value, options)
  }

  pathParam<T = string>(name: string, options: ParamOptions<T> = {}): T | null {
    return this.value(name, this.req.params[name], options)
  }

  searchParam<T = string>(
    name: string,
    options: ParamOptions<T> = {}
  ): T | null {
    return this.value(name, this.req.query[name], options)
  }

  bodyParam<T = string>(name: string, options: ParamOptions<T> = {}): T | null {
    return this.value(name, this.req.body[name], options)
  }
}
