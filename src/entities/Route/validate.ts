import Ajv from 'ajv'
import RequestError from './error'

export default function validate<R extends {}>(
  validator: Ajv.ValidateFunction,
  body: Record<string, any> = {}
): R {
  if (!validator(body) && validator.errors && validator.errors.length > 0) {
    const messages = validator.errors
      .map((error) => {
        let message = ''
        if (error.dataPath) {
          message += error.dataPath.slice(1)
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
        code: 'bad_request',
        errors: [...validator.errors],
        messages,
        body,
      }
    )
  }

  return body as R
}
