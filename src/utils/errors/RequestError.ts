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
    this.message = `Error fetching data from "${this.method} ${clearURL(
      url
    )}"${bodyToDetails(body)}`
    res.headers.forEach((value, key) => {
      console.log(key, value)
      this.headers[key] = value
    })
    this.code = res.status >= 500 ? 'SERVER_ERROR' : 'REQUEST_ERROR'
    this.statusCode = res.status
    this.body = body
  }
}

function clearURL(url: string): string {
  try {
    const target = new URL(url)
    target.search = ''
    target.hash = ''
    return target.toString()
  } catch {
    return url
  }
}

function bodyToDetails(body: any): string {
  if (!body) {
    return ''
  }

  if (body.message) {
    return ': ' + body.message
  }

  if (body.error) {
    return ': ' + body.error
  }

  console.log(body)
  return ': ' + JSON.stringify(body)
}
