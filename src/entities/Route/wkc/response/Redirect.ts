import Response from './Response'

export default class Redirect implements Response {
  status: number | undefined
  statusText?: string | undefined
  headers?: Record<string, string> | undefined
  constructor(
    location: string | URL,
    status:
      | typeof Response.MovedPermanently
      | typeof Response.MovedTemporarily
      | typeof Response.PermanentRedirect
      | typeof Response.TemporaryRedirect = Response.MovedTemporarily
  ) {
    this.status = status
    this.statusText = Response.StatusText[status]
    this.headers = {
      location: location.toString(),
    }
  }
}
