import Response from './Response'

export type ApiResponseBody<
  Data = any,
  Extra extends Record<string, any> = {}
> = {
  ok: boolean
  data: Data
} & Extra

export default class ApiResponse<
  Data = any,
  Extra extends Record<string, any> = {}
> implements Response
{
  headers: Record<string, string>

  body: ApiResponseBody<Data, Extra>

  constructor(data: Data, extra?: Extra) {
    this.headers = {
      'content-type': 'application/json',
    }

    this.body = {
      ...extra,
      ok: true,
      data,
    } as ApiResponseBody<Data, Extra>
  }
}
