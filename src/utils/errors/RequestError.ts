export default class RequestError extends Error {
  code: 'REQUEST_ERROR' | 'SERVER_ERROR'
  statusCode: number
  body: any
  constructor(public url: string, public options: RequestInit, res: Response, body: any) {
    super(`Error fetching data from "${url}"${body && body.message ? ': ' + body.message : ''}`)
    this.code = res.status >= 500 ? 'SERVER_ERROR' : 'REQUEST_ERROR'
    this.statusCode = res.status
    this.body = body
  }
}