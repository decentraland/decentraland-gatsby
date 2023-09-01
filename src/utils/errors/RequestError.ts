export default class RequestError extends Error {
  code: 'REQUEST_ERROR' | 'SERVER_ERROR'
  method: string
  url: string
  options: RequestInit
  headers: Record<string, string | null> = {}
  statusCode: number
  body: any
  constructor(url: string, options: RequestInit, res: Response, body: any) {
    super()
    this.url = url
    this.options = options
    this.method = (options.method || 'get').toLowerCase()
    const target = new URL(url)
    target.search = ''
    target.hash = ''
    const details =
      body && body.message
        ? ': ' + body.message
        : body && body.error
        ? ': ' + body.error
        : body
        ? ': ' + JSON.stringify(body)
        : ''
    this.message = `Error fetching data from "${
      this.method
    } ${target.toString()}"${details}`
    res.headers.forEach((value, key) => {
      this.headers[key] = value
    })
    this.code = res.status >= 500 ? 'SERVER_ERROR' : 'REQUEST_ERROR'
    this.statusCode = res.status
    this.body = body
  }
}
