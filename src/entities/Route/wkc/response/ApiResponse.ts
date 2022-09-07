import Response from './Response'

export default class ApiResponse<Data = any> implements Response {
  headers: Record<string, string>

  body: {
    ok: boolean
    data: Data
    [key: string]: any
  }

  constructor(data: Data, extra: Record<string, any> = {}) {
    this.headers = {
      'content-type': 'application/json',
    }

    this.body = {
      ...extra,
      ok: true,
      data,
    }
  }
}
