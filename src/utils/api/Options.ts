import { getCurrentIdentity } from '../auth/storage'
import { Identity } from '../auth/types'
import { toBase64 } from '../string/base64'

export type RequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
}

export default class Options {
  private options: RequestOptions = {}
  constructor(options: RequestOptions = {}) {
    this.options = options
  }

  merge(options: Options) {
    const raw = options.toObject()
    const newOptions = {
      ...this.options,
      ...raw,
    }

    if (this.options.headers || raw.headers) {
      newOptions.headers = {
        ...this.options.headers,
        ...raw.headers,
      }
    }

    return new Options(newOptions)
  }

  set(options: Omit<RequestOptions, 'headers' | 'body'> = {}) {
    const newOptions = {
      ...this.options,
      ...options,
    }

    if (this.options.headers) {
      newOptions.headers = this.options.headers
    }

    if (this.options.body) {
      newOptions.headers = this.options.headers
    }

    this.options = newOptions

    return this
  }

  authorization() {
    const identity: Identity | null = getCurrentIdentity()
    if (!identity || !identity.authChain) {
      return this
    }

    return this.header(
      'Authorization',
      'Bearer ' + toBase64(JSON.stringify(identity.authChain))
    )
  }

  header(key: string, value: string) {
    if (!this.options.headers) {
      this.options.headers = {}
    }

    if (this.options.headers[key]) {
      console.warn(
        `Can not set header "${key}" as "${value}" because is already defined as "${this.options.headers[key]}"`
      )
    } else {
      this.options.headers[key] = value
    }

    return this
  }

  headers(headers: Record<string, string>) {
    Object.keys(headers).forEach((key) => this.header(key, headers[key]))

    return this
  }

  method(method: string) {
    this.options.method = method
    return this
  }

  json(data: any) {
    this.header('Content-Type', 'application/json')
    this.options.body = JSON.stringify(data)
    return this
  }

  toObject() {
    return this.options
  }
}
