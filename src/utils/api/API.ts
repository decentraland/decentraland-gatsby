import fetch from 'isomorphic-fetch'
import FetchError from '../errors/FetchError'
import RequestError from '../errors/RequestError'

export default class API {

  constructor(public readonly baseUrl: string, public readonly defaultOptions: RequestInit = {}) { }

  url(path: string) {
    let baseUrl = this.baseUrl

    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1)
    }

    if (!path.startsWith('/')) {
      path = '/' + path
    }

    return baseUrl + path
  }

  options(options: RequestInit = {}): RequestInit {
    return {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...(this.defaultOptions.headers || {}),
        ...(options.headers || {})
      }
    }
  }

  async fetch<T extends object>(path: string, options: RequestInit = {}): Promise<T> {

    let res: Response;
    let json: T;
    const url = this.url(path);
    const opt = this.options(options);

    try {
      res = await fetch(url, opt)
    } catch (error) {
      throw new FetchError(url, opt, error.message)
    }

    try {
      json = await res.json() as T
    } catch (error) {
      throw new FetchError(url, opt, error.message)
    }

    if (res.status >= 400) {
      throw new RequestError(url, opt, res, json)
    }

    return json
  }
}