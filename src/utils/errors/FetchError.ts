export default class FetchError extends Error {
  code = 'FETCH_ERROR'
  constructor(
    public url: string,
    public options: RequestInit = {},
    message: string
  ) {
    super(`Fail to fetch resource from "${url}": ${message}`)
  }
}
