import logger from '../../entities/Development/logger'
import FetchError from '../errors/FetchError'
import RequestError from '../errors/RequestError'
import Options, { RequestOptions } from './Options'
import 'isomorphic-fetch'
import { signPayload } from '../auth/identify'
import { getCurrentIdentity } from '../auth'
import {
  AUTH_CHAIN_HEADER_PREFIX,
  AUTH_METADATA_HEADER,
  AUTH_TIMESTAMP_HEADER,
} from './API.types'

export default class API {
  static catch<T>(prom: Promise<T>) {
    return prom.catch((err) => {
      logger.error(err)
      return null
    })
  }

  static url(
    base: string,
    path: string = '',
    query: Record<string, string> | URLSearchParams = {}
  ) {
    if (base.endsWith('/')) {
      base = base.slice(0, -1)
    }

    if (path !== '' && !path.startsWith('/')) {
      path = '/' + path
    }

    let params = new URLSearchParams(query).toString()
    if (params) {
      if (path.includes('?')) {
        params = '&' + params
      } else {
        params = '?' + params
      }
    }

    return base + path + params
  }

  readonly baseUrl: string = ''
  readonly defaultOptions: Options = new Options({})

  constructor(baseUrl: string = '', defaultOptions: Options = new Options({})) {
    this.baseUrl = baseUrl || ''
    this.defaultOptions = defaultOptions
  }

  url(path: string, query: Record<string, string> | URLSearchParams = {}) {
    return API.url(this.baseUrl, path, query)
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

  async signedFetch<T extends object>(
    path: string,
    options: Options = new Options({})
  ) {
    const identify = await getCurrentIdentity()
    if (!identify) {
      throw Object.assign(new Error(`Missing identity to sign the request`), {
        path,
        options: this.defaultOptions.merge(options).toObject(),
      })
    }

    const { body, ...opt } = this.defaultOptions.merge(options).toObject()
    const timestamp = String(Date.now())
    const pathname = new URL(this.url(path)).pathname
    const method = opt.method || 'GET'
    const metadata = (body as string) || '{}'
    const payload = [method, pathname, timestamp, metadata]
      .join(':')
      .toLowerCase()
    const chain = await signPayload(identify, payload)

    const newOptions = this.options(opt)
    chain.forEach((link, i) =>
      newOptions.header(AUTH_CHAIN_HEADER_PREFIX + i, JSON.stringify(link))
    )
    newOptions.header(AUTH_TIMESTAMP_HEADER, timestamp)
    newOptions.header(AUTH_METADATA_HEADER, metadata)

    return this.fetch<T>(path, newOptions)
  }

  async fetch<T extends object>(
    path: string,
    options: Options = new Options({})
  ): Promise<T> {
    let res: Response
    let body: string = ''
    let json: T = null as any
    const url = this.url(path)
    const opt = this.defaultOptions.merge(options)

    try {
      res = await fetch(url, opt.toObject())
    } catch (error) {
      console.error()
      throw new FetchError(url, opt.toObject(), error.message)
    }

    try {
      body = await res.text()
    } catch (error) {
      throw new RequestError(url, opt.toObject(), res, body)
    }

    try {
      json = JSON.parse(body || '{}') as T
    } catch (error) {
      throw new RequestError(
        url,
        opt.toObject(),
        res,
        error.message + ' at ' + body
      )
    }

    if (res.status >= 400) {
      throw new RequestError(url, opt.toObject(), res, json)
    }

    return json
  }
}
