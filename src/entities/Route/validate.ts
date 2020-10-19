import Ajv from 'ajv'
import RequestError from './error'

export default function validate(validator: Ajv.ValidateFunction, body: Record<string, any>) {
  if (validator(body) && validator.errors && validator.errors.length > 0) {

    const errors = validator.errors
    .map((error) => `${error.dataPath.slice(1)} ${error.message!}`)
    .filter(Boolean)

    new RequestError('Invalid event data', RequestError.BadRequest, { errors, body })
  }
}