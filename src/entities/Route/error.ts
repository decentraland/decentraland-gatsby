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

  static toJSON(err: Error | RequestError) {
    const result: Record<string, any> = {
      ok: false,
      error: err.message,
    }

    if ((err as RequestError).code) {
      result.code = (err as RequestError).code
    }

    if (Object.keys((err as RequestError).data || {}).length > 0) {
      result.data = (err as RequestError).data
    }

    if (result.stack && process.env.NODE_ENV !== 'production') {
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
