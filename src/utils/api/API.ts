import fetch from 'isomorphic-fetch'
import FetchError from '../errors/FetchError'
import RequestError from '../errors/RequestError'
import Options, { RequestOptions } from './Options'

export default class API {

  readonly baseUrl: string = ''
  readonly defaultOptions: Options = new Options({})

  static catch<T>(prom: Promise<T>) {
    return prom.catch((err) => {
      console.error(err)
      return null
    })
  }

  constructor(baseUrl: string = '', defaultOptions: Options = new Options({})) {
    this.baseUrl = baseUrl || ''
    this.defaultOptions = defaultOptions
  }

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

  options(options: RequestOptions = {}) {
    return new Options(options)
  }

  query<T extends {} = {}>(qs?: T) {
    if (!qs) {
      return ''
    }

    const params = new URLSearchParams()
    for (const key of Object.keys(qs)) {
      if (qs[key] === null) {
        params.set(key, '')
      } else if (qs[key] !== undefined) {
        params.set(key, qs[key])
      }
    }

    const queryString = params.toString()
    if (!queryString) {
      return ''
    }

    return '?' + queryString
  }

  async fetch<T extends object>(path: string, options: Options = new Options({})): Promise<T> {

    let res: Response;
    let json: T;
    const url = this.url(path);
    const opt = this.defaultOptions.merge(options);

    try {
      res = await fetch(url, opt.toObject())
    } catch (error) {
      throw new FetchError(url, opt.toObject(), error.message)
    }

    try {
      json = await res.json() as T
    } catch (error) {
      throw new FetchError(url, opt.toObject(), error.message)
    }

    if (res.status >= 400) {
      throw new RequestError(url, opt.toObject(), res, json)
    }

    return json
  }
}