import {
  AUTH_CHAIN_HEADER_PREFIX,
  AUTH_METADATA_HEADER,
  AUTH_TIMESTAMP_HEADER,
} from 'decentraland-crypto-middleware/lib/types'
import { sleep } from 'radash'

import logger from '../../entities/Development/logger'
import { signPayload } from '../auth/identify'
import { getCurrentIdentity } from '../auth/storage'
import FetchError from '../errors/FetchError'
import RequestError from '../errors/RequestError'
import { toBase64 } from '../string/base64'
import Options, { RequestOptions } from './Options'

import type { Identity } from '../auth/types'

export type SearchParamValue = boolean | number | string | Date
export type SearchParamData = Record<
  string,
  undefined | null | SearchParamValue | SearchParamValue[]
>
export type SearchParamOptions<D extends SearchParamData = SearchParamData> =
  Partial<{
    dataToTimestamp: boolean
    default: Partial<D>
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

  static fromPagination<T extends { page: number }>(
    { page, ...data }: T,
    options: { pageSize: number }
  ): Omit<T, 'page'> & { limit: number; offset: number } {
    return {
      ...data,
      limit: options.pageSize,
      offset: (page - 1) * options.pageSize,
    }
  }

  static searchParams<D extends SearchParamData>(
    data: D,
    options: SearchParamOptions<D> = {}
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

    if (options?.default) {
      for (const param of Object.keys(options.default)) {
        if (data[param] === options.default[param]) {
          params.delete(param)
        }
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
  #fetcher: typeof fetch | null = null
  #fetch: typeof fetch = (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => {
    if (this.#fetcher) {
      return this.#fetcher(input, init)
    }

    if (typeof fetch !== 'undefined') {
      return fetch(input, init)
    }

    throw new ReferenceError(
      `fecher is not defined on API, use .setFetcher() to set it`
    )
  }

  constructor(baseUrl = '', defaultOptions: Options = new Options({})) {
    this.baseUrl = baseUrl || ''
    this.defaultOptions = defaultOptions
  }

  setFetcher(fetcher: typeof fetch) {
    this.#fetch = fetcher
    return this
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
    for (const key of Object.keys(qs) as (keyof T)[]) {
      if (qs[key] === null) {
        params.set(String(key), '')
      } else if (qs[key] !== undefined) {
        params.set(String(key), String(qs[key]))
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
        const pathname = new URL(this.url(path), 'https://localhost').pathname
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

  timeoutOption() {}

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
    const timeout = opt.getTimeout()

    try {
      // timeout 0 automatically returns a Request Timeout
      if ((timeout.timeout && timeout.timeout <= 0) || timeout.timeout === 0) {
        // if timeoutFallback exists, return it
        if ('timeoutFallback' in timeout) {
          res = new Response(JSON.stringify(timeout.timeoutFallback), {
            status: 200,
          })
        } else {
          res = new Response('Request Timeout', { status: 408 })
        }

        // if timeout exceeds 0, then perform the fetch with a timeout
      } else if (timeout.timeout) {
        let completed = false
        const controller = new AbortController()

        // race against fetch and timeout
        res = await Promise.race([
          this.#fetch(url, opt.toObject({ signal: controller.signal })).then(
            (res) => {
              completed = true
              return res
            }
          ),

          sleep(timeout.timeout).then(() => {
            // abort fetch in background
            if (!completed) {
              controller.abort()
            }

            // if timeoutFallback exists, return it
            if ('timeoutFallback' in timeout) {
              return new Response(JSON.stringify(timeout.timeoutFallback), {
                status: 200,
              })
            }

            // if there is no timeoutFallback, return a Request Timeout
            return new Response('Request Timeout', { status: 408 })
          }),
        ])

        // If not timeout was set then just perform the fetch
      } else {
        res = await this.#fetch(url, opt.toObject())
      }
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
      console.log('parse error', timeout, error)
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
