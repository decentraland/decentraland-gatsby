import Ajv from 'ajv'
import RequestError from './error'

export default function validate<R extends {}>(validator: Ajv.ValidateFunction, body: Record<string, any> = {}): R {
  if (validator(body) && validator.errors && validator.errors.length > 0) {

    const errors = validator.errors
    .map((error) => `${error.dataPath.slice(1)} ${error.message!}`)
    .filter(Boolean)

    throw new RequestError('Bad request', RequestError.BadRequest, { errors, body })
  }

  return body as R
}
