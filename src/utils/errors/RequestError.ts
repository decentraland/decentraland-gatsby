export default class RequestError extends Error {
  code: 'REQUEST_ERROR' | 'SERVER_ERROR'
  headers: Record<string, string | null> = {}
  statusCode: number
  body: any
  constructor(
    public url: string,
    public options: RequestInit,
    res: Response,
    body: any
  ) {
    super(
      `Error fetching data from "${url}"${
        body && body.message
          ? ': ' + body.message
          : body && body.error
          ? ': ' + body.error
          : body
          ? ': ' + JSON.stringify(body)
          : ''
      }`
    )
    res.headers.forEach((value, key) => {
      this.headers[key] = value
    })
    this.code = res.status >= 500 ? 'SERVER_ERROR' : 'REQUEST_ERROR'
    this.statusCode = res.status
    this.body = body
  }
}
