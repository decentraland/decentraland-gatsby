export default class FetchError extends Error {
  code = 'FETCH_ERROR'
  url: string
  options: RequestInit = {}
  constructor(url: string, options: RequestInit = {}, message: string) {
    super(`Fail to fetch resource "${options.method} ${url}": ${message}`)
    this.url = url
    this.options = options
  }
}
