import fetch from 'isomorphic-fetch'
import FetchError from '../errors/FetchError'
import RequestError from '../errors/RequestError'
import Options from './Options'

export default class API {

  static catch<T>(prom: Promise<T>) {
    return prom.catch((err) => {
      console.error(err)
      return null
    })
  }

  constructor(public readonly baseUrl: string, public readonly defaultOptions: Options = new Options({})) { }

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