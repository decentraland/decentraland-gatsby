import env from '../../utils/env'

export default class RequestError extends Error {
  static BadRequest = 400
  static Unauthorized = 401
  static Forbidden = 403
  static NotFound = 404
  static PayloadTooLarge = 413
  static IAmATeapot = 418
  static TooManyRequests = 429
  static InternalServerError = 500
  static NotImplemented = 501
  static ServiceUnavailable = 503

  static Code = {
    [400]: 'bad_request',
    [401]: 'unauthorized',
    [403]: 'forbidden',
    [404]: 'not_found',
    [413]: 'payload_too_large',
    [418]: 'i_am_a_teapot',
    [429]: 'too_many_requests',
    [500]: 'internal_server_error',
    [501]: 'not_implemented',
    [503]: 'service_unavailable',
  }

  static toJSON(err: Error | RequestError) {
    const result: Record<string, any> = {
      ok: false,
      error: err.message,
    }

    if ((err as RequestError).code) {
      result.code = (err as RequestError).code
    }

    if (
      !(err as RequestError).code &&
      (err as RequestError).statusCode &&
      RequestError[(err as RequestError).statusCode!]
    ) {
      result.code = RequestError[(err as RequestError).statusCode!]
    }

    if (Object.keys((err as RequestError).data || {}).length > 0) {
      result.data = (err as RequestError).data
    }

    if (result.stack && env('NODE_ENV', 'development') === 'production') {
      result.stack = err.stack
    }

    return result
  }

  code?: string
  statusCode?: number
  data?: Record<string, any>

  constructor(
    message: string,
    statusCode: number = RequestError.InternalServerError,
    extra: Record<string, any> = {}
  ) {
    super(message)
    this.statusCode = statusCode
    const { code, ...data } = extra

    if (code) {
      this.code = code
    }

    if (Object.keys(data).length > 0) {
      this.data = data
    }
  }
}
