import Response, { ResponseBody } from './Response'

export default class ContentTypeResponse<Data extends ResponseBody>
  implements Response
{
  headers: Record<string, string>

  body: Data

  constructor(data: Data, contentType?: string) {
    this.headers = {}

    if (contentType) {
      this.headers['content-type'] = contentType
    }

    this.body = data
  }
}
