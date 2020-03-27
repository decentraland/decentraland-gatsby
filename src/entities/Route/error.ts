export default class RequestError extends Error {

  static BadRequest = 400
  static Unauthorized = 401
  static Forbidden = 403
  static NotFound = 404
  static IAmATeapot = 418
  static TooManyRequests = 429
  static InternalServerError = 500
  static NotImplemented = 501
  static ServiceUnavailable = 503

  constructor(message: string, public statusCode: number = RequestError.InternalServerError, public data?: any) {
    super(message)
  }
}
