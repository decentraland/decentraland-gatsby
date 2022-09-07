import Response from './Response'

export default class ContentTypeResponse<Data = any> implements Response {
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
