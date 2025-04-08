import { Ajv, ValidateFunction } from 'ajv'

import defaultAjv from '../Schema/index'
import { AjvObjectSchema } from '../Schema/types'
import RequestError from './error'

export default function validate<R extends {}>(
  validator: ValidateFunction,
  body: Record<string, any> = {}
): R {
  if (!validator(body) && validator.errors && validator.errors.length > 0) {
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

    throw new RequestError(
      'Invalid data was sent to the server',
      RequestError.BadRequest,
      {
        errors: [...validator.errors],
        messages,
        body,
      }
    )
  }

  return body as R
}

export function createValidator<R extends {}>(
  schema: AjvObjectSchema,
  ajv: Ajv = defaultAjv
) {
  const validator = ajv.compile(schema)
  return function (body: Record<string, any> = {}): R {
    return validate(validator, body) as R
  }
}
