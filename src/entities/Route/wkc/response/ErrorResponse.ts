import Response from './Response'

export default class ErrorResponse extends Error {
  static toResponse(err: ErrorResponse): Response {
    const body: Record<string, any> = {
      ok: false,
      error: err.message,
    }

    const { code, ...data } = err.data || {}

    if (code) {
      body.code = code
    } else if (err.status && Response.StatusCode[err.status]) {
      body.code = Response.StatusCode[err.status]
    } else {
      body.code = Response.StatusCode[Response.InternalServerError]
    }

    if (Object.keys(data || {}).length > 0) {
      body.data = data
    }

    if (err.stack && process.env.NODE_ENV === 'production') {
      body.stack = err.stack
    }

    const status = err.status || Response.InternalServerError
    const statusText =
      Response.StatusText[status] ||
      Response.StatusText[Response.InternalServerError]

    return {
      status,
      statusText,
      body,
    }
  }

  status?: number = Response.InternalServerError
  data?: { code?: string } & Record<string, any> = {}

  constructor(
    status: number = Response.InternalServerError,
    message: string = Response.StatusText[status] ||
      Response.StatusText[Response.InternalServerError],
    data: { code?: string } & Record<string, any> = {}
  ) {
    super(message)
    this.status = status
    this.data = Object.assign(this.data || {}, data)
  }
}
