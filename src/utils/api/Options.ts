export type RequestOptions = Omit<RequestInit, 'headers'> &
  Partial<{
    headers: Record<string, string>
  }>

export type RequestTimeoutOptions = Partial<{
  timeout: number
  timeoutFallback: any
}>

export type RequestAuthorizationOptions = Partial<{
  identity: boolean
  sign: boolean
  optional: boolean
}>

export default class Options {
  #options: RequestOptions = {}
  #authorization: RequestAuthorizationOptions = {}
  #timeout: RequestTimeoutOptions = {}
  #metadata: Record<string, string | number> = {}

  constructor(options: RequestOptions = {}) {
    this.#options = options
  }

  merge(options: Options) {
    const raw = options.toObject()
    const newOptions = {
      ...this.#options,
      ...raw,
    }

    if (this.#options.headers || raw.headers) {
      newOptions.headers = {
        ...this.#options.headers,
        ...raw.headers,
      }
    }

    const result = new Options(newOptions)
    result.#authorization = {
      ...this.#authorization,
      ...options.#authorization,
    }

    result.#metadata = {
      ...this.#metadata,
      ...options.#metadata,
    }

    result.#timeout = {
      ...this.#timeout,
      ...options.#timeout,
    }

    return result
  }

  set(options: Omit<RequestOptions, 'headers' | 'body'> = {}) {
    const newOptions = {
      ...this.#options,
      ...options,
    }

    if (this.#options.headers) {
      newOptions.headers = this.#options.headers
    }

    if (this.#options.body) {
      newOptions.body = this.#options.body
    }

    this.#options = newOptions

    return this
  }

  /**
   * Timeout a request using an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) object.
   *
   * If the remote servers doesn't repond in the timeframe the request Request
   * will fail with a 408 http error and will internally abort the request to
   * prevent memory leaks.
   *
   * If you want to return a fallback value instead of failing, use the `timeoutWithFallback`
   * method instead.
   */
  timeout(timeout: number) {
    this.#timeout.timeout = Math.max(0, timeout)
    return this
  }

  /**
   * Timeout a request using an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) object.
   *
   * If the remote servers doesn't repond in the timeframe the request Request
   * will return the fallback parameter instead of failing and will internally
   * abort the request to prevent memory leaks.
   */
  timeoutWithFallback(timeout: number, fallback: any) {
    this.timeout(timeout)
    this.#timeout.timeoutFallback = fallback
    return this
  }

  authorization(
    options: RequestAuthorizationOptions = { identity: true, optional: true }
  ) {
    this.#authorization = options
    return this
  }

  header(key: string, value: string) {
    if (!this.#options.headers) {
      this.#options.headers = {}
    }

    key = key.toLowerCase()
    if (this.#options.headers[key]) {
      console.warn(
        `Can not set header "${key}" as "${value}" because is already defined as "${
          this.#options.headers[key]
        }"`
      )
    } else {
      this.#options.headers[key] = value
    }

    return this
  }

  headers(headers: Record<string, string>) {
    Object.keys(headers).forEach((key) =>
      this.header(key.toLowerCase(), headers[key])
    )
    return this
  }

  method(method: string) {
    this.#options.method = method
    return this
  }

  getMethod() {
    return this.#options.method || 'GET'
  }

  metadata(data: Record<string, string | number>) {
    this.#metadata = {
      ...this.#metadata,
      ...data,
    }

    return this
  }

  getMetadata(): Record<string, string | number> {
    return this.#metadata
  }

  json(data: any) {
    this.header('content-type', 'application/json')
    this.#options.body = JSON.stringify(data)
    return this
  }

  getAuthorization() {
    return this.#authorization
  }

  getTimeout() {
    return this.#timeout
  }

  toObject(extend: RequestOptions = {}) {
    return { ...this.#options, ...extend }
  }
}
