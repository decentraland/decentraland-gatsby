export default class FetchError extends Error {
  code = 'FETCH_ERROR'
  constructor(
    public url: string,
    public options: RequestInit = {},
    message: string
  ) {
    super(`Fail to fetch resource "${options.method} ${url}": ${message}`)
  }
}
