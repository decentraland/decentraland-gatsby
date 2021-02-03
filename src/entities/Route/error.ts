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

  static toJSON(err: Error & { data?: any }) {
    const result: Record<string, any> = {
      ok: false,
      error: err.message,
    }

    if (err.data) {
      result.data = err.data
    }

    if (result.stack && process.env.NODE_ENV !== 'production') {
      result.stack = err.stack
    }

    return result
  }

  constructor(message: string, public statusCode: number = RequestError.InternalServerError, public data?: any) {
    super(message)
  }
}
