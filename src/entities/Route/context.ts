import { Request, Response } from "express";
import RequestError from "./error";

export type ParamOptions<T> = {
  validator?: (value: any) => boolean,
  parser?: (value: any) => T | null
  required?: boolean
  defaultValue?: T
}

export default class Context {
  constructor(public readonly req: Request, public readonly res: Response) { }

  header(name: string, defaultValue: string) {
    return this.req.header(name) || defaultValue;
  }

  param<T = string>(name: string, options: ParamOptions<T> = {}): T | null {

    let value = this.req.param(name, options.defaultValue);

    if (value === undefined || value === null) {
      if (options.required) {
        throw new RequestError(`Param ${name} is required`, RequestError.BadRequest);
      }

      return null
    }

    let finalValue: T = options.parser ? options.parser(value) : value as any

    if (options.validator && !options.validator(finalValue)) {
      if (options.required) {
        throw new RequestError(`Invalid param ${name}: "${value}"`, RequestError.BadRequest);
      }

      return null
    }

    return finalValue
  }
}