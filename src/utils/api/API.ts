import {
  AUTH_CHAIN_HEADER_PREFIX,
  AUTH_METADATA_HEADER,
  AUTH_TIMESTAMP_HEADER,
} from 'decentraland-crypto-middleware/lib/types'

import logger from '../../entities/Development/logger'
import { signPayload } from '../auth/identify'
import { getCurrentIdentity } from '../auth/storage'
import FetchError from '../errors/FetchError'
import RequestError from '../errors/RequestError'
import { toBase64 } from '../string/base64'
import Options, { RequestOptions } from './Options'

import type { Identity } from '../auth/types'

import 'isomorphic-fetch'

export type SearchParamValue = boolean | number | string | Date
export type SearchParamOptions = Partial<{
  dataToTimestamp: boolean
}>

export default class API {
  static catch<T>(prom: Promise<T>) {
    return prom.catch((err) => {
      logger.error(err)
      return null
    })
  }

  static #searchParamsValue(
    value: SearchParamValue,
    options: SearchParamOptions
  ): string {
    if (value instanceof Date) {
      return options.dataToTimestamp ? String(value.getTime()) : value.toJSON()
    }

    return String(value)
  }

  static searchParams(
    data: Record<
      string,
      undefined | null | SearchParamValue | SearchParamValue[]
    >,
    options: SearchParamOptions = {}
  ): URLSearchParams {
    const params = new URLSearchParams()
    const keys = Object.keys(data)

    for (const key of keys) {
      const value = data[key] as
        | undefined
        | null
        | SearchParamValue
        | SearchParamValue[]
      if (value === undefined || value === null) {
        continue
      }

      if (Array.isArray(value)) {
        for (const each of value) {
          params.append(key, this.#searchParamsValue(each, options))
        }
      } else {
        params.append(key, this.#searchParamsValue(value, options))
      }
    }

    return params
  }

  static url(
    base: string,
    path = '',
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

  constructor(baseUrl = '', defaultOptions: Options = new Options({})) {
    this.baseUrl = baseUrl || ''
    this.defaultOptions = defaultOptions
  }

  url(path: string, query: Record<string, string> | URLSearchParams = {}) {
    return API.url(this.baseUrl, path, query)
  }

  options(options: RequestOptions = {}) {
    return new Options(options)
  }

  /** @deprecated use API.searchParams instead */
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

  async authorizeOptions(
    path: string,
    options: Options = new Options({})
  ): Promise<Options> {
    const config = options.getAuthorization()

    if (config.identity) {
      const identity: Identity | null = getCurrentIdentity()
      if (!identity?.authChain && !config.optional) {
        throw new FetchError(
          path,
          options.toObject(),
          'Missing identity to autorize the request'
        )
      }

      if (identity?.authChain) {
        options.header(
          'Authorization',
          'Bearer ' + toBase64(JSON.stringify(identity.authChain))
        )
      }
    }

    return options
  }

  async signOptions(
    path: string,
    options: Options = new Options({})
  ): Promise<Options> {
    const config = options.getAuthorization()

    if (config.sign) {
      const identity = getCurrentIdentity()
      if (!identity?.authChain && !config.optional) {
        throw new FetchError(
          path,
          options.toObject(),
          'Missing identity to sign the request'
        )
      }

      if (identity?.authChain) {
        const timestamp = String(Date.now())
        const pathname = new URL(this.url(path)).pathname
        const method = options.getMethod() || 'GET'
        const metadata = JSON.stringify(options.getMetadata())
        const payload = [method, pathname, timestamp, metadata]
          .join(':')
          .toLowerCase()
        const chain = await signPayload(identity, payload)

        chain.forEach((link, i) =>
          options.header(AUTH_CHAIN_HEADER_PREFIX + i, JSON.stringify(link))
        )
        options.header(AUTH_TIMESTAMP_HEADER, timestamp)
        options.header(AUTH_METADATA_HEADER, metadata)
        return options
      }
    }

    return options
  }

  async fetch<T extends {}>(
    path: string,
    options: Options = new Options({})
  ): Promise<T> {
    let res: Response
    let body = ''
    let json: T = null as any
    const url = this.url(path)

    let opt = this.defaultOptions.merge(options)
    opt = await this.authorizeOptions(path, opt)
    opt = await this.signOptions(path, opt)

    try {
      res = await fetch(url, opt.toObject())
    } catch (error) {
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
