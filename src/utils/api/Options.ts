export type RequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
}

export type RequestAuthorizationOptions = Partial<{
  identity: boolean
  sign: boolean
  optional: boolean
}>

export default class Options {
  private _options: RequestOptions = {}

  private _authorization: RequestAuthorizationOptions = {}

  private _metadata: Record<string, string | number> = {}

  constructor(options: RequestOptions = {}) {
    this._options = options
  }

  merge(options: Options) {
    const raw = options.toObject()
    const newOptions = {
      ...this._options,
      ...raw,
    }

    if (this._options.headers || raw.headers) {
      newOptions.headers = {
        ...this._options.headers,
        ...raw.headers,
      }
    }

    const result = new Options(newOptions)

    result.authorization({
      ...this._authorization,
      ...options.getAuthorization(),
    })

    result.metadata({
      ...this._metadata,
      ...options.getMetadata(),
    })

    return result
  }

  set(options: Omit<RequestOptions, 'headers' | 'body'> = {}) {
    const newOptions = {
      ...this._options,
      ...options,
    }

    if (this._options.headers) {
      newOptions.headers = this._options.headers
    }

    if (this._options.body) {
      newOptions.headers = this._options.headers
    }

    this._options = newOptions

    return this
  }

  authorization(
    options: RequestAuthorizationOptions = { identity: true, optional: true }
  ) {
    this._authorization = options
    return this
  }

  header(key: string, value: string) {
    if (!this._options.headers) {
      this._options.headers = {}
    }

    if (this._options.headers[key]) {
      console.warn(
        `Can not set header "${key}" as "${value}" because is already defined as "${this._options.headers[key]}"`
      )
    } else {
      this._options.headers[key] = value
    }

    return this
  }

  headers(headers: Record<string, string>) {
    Object.keys(headers).forEach((key) => this.header(key, headers[key]))
    return this
  }

  method(method: string) {
    this._options.method = method
    return this
  }

  getMethod() {
    return this._options.method || 'GET'
  }

  metadata(data: Record<string, string | number>) {
    this._metadata = {
      ...this._metadata,
      ...data,
    }

    return this
  }

  getMetadata() {
    return this._metadata
  }

  json(data: any) {
    this.header('Content-Type', 'application/json')
    this._options.body = JSON.stringify(data)
    return this
  }

  getAuthorization() {
    return this._authorization
  }

  toObject() {
    return this._options
  }
}
