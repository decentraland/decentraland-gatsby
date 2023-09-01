import RequestError from './error'

import type { Request } from 'express'

export type ParamOptions = {
  validator: (value: any) => boolean
  parser: <T>(value: any) => T
}

/**
 * @deprecated use the handle context instead
 */
export default function param<T = string>(
  req: Request,
  name: string,
  validator: (value: any) => boolean = Boolean
): T {
  let value

  if (req.query && req.query[name]) {
    value = req.query[name]
  } else if (req.body && req.body[name]) {
    value = req.body[name]
  } else if (req.params && req.params[name]) {
    value = req.params[name]
  }

  if (validator && !validator(value)) {
    throw new RequestError(
      `Invalid param ${name}: "${value}"`,
      RequestError.BadRequest
    )
  }

  return value
}

export function num(value: any): number | null {
  if (typeof value === 'string') {
    value = Number(value)
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  return null
}

/** @deprecated */
export function bool(value: any): boolean | null {
  switch (value) {
    case 1:
    case true:
    case '1':
    case 'true':
    case 'True':
    case 'TRUE':
      return true

    case 0:
    case false:
    case '0':
    case 'false':
    case 'False':
    case 'FALSE':
      return false

    default:
      return null
  }
}

/** @deprecated */
export function number(value: any): number | null {
  if (value === '' || value === undefined || value === null) {
    return null
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return null
  }

  return parsed
}

/** @deprecated */
export function integer(value: any): number | null {
  const parsed = number(value)

  if (parsed === null) {
    return null
  }

  const int = parsed | 0
  if (int !== parsed) {
    return null
  }

  return int
}
