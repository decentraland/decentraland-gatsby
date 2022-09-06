import * as http from 'http'

import { Router, RouterOptions } from 'express'

import type * as fetch from 'node-fetch'
export type RouterHandler = (router: Router) => void
export type RoutesOptions = RouterOptions

export type DDosOptions = {
  limit: number
  maxcount: number
  burst: number
  maxexpiry: number
  checkinterval: number
  responseStatus: number
}

export type CorsOptions = {
  cors?: 'public' | '*' | 'default' | 'same-origin' | false
  corsOrigin?: boolean | string | RegExp | (string | RegExp)[]
  allowedHeaders?: string | string[]
  exposedHeaders?: string | string[]
}

export type BodyParserOptions = {
  json?: boolean
  urlencode?: boolean
}

export type Request = fetch.Request & {
  method: string // or type like "CONNECT" | "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT" | "TRACE"
  hostname: string
  path: string
  baseUrl: string
  originalUrl: string
  connection: {
    remoteAddress?: string
  }
  socket: {
    remoteAddress?: string
  }
  route?: {
    path: string
  }
  headers: [{ [key: string]: string }]
  header?: any
  body?: any
  params?: any
  query?: any
  IncomingMessage: {
    clone?: any
    context?: any
    redirect?: any
    referrer?: any
  }
}

export type NextFunction = (err?: any) => void
/*   (deferToNext: 'router'): void
  (deferToNext: 'route'): void
} */

export function createCorsOptions(options: CorsOptions = {}) {
  if (options.corsOrigin) {
    return {
      origin: options.corsOrigin,
      allowedHeaders: options.allowedHeaders || defaultAllowedHeaders,
      exposedHeaders: options.exposedHeaders || defaultExposedHeaders,
    }
  }

  switch (options.cors) {
    case false:
    case 'same-origin':
      return {
        origin: false,
        allowedHeaders: options.allowedHeaders || defaultAllowedHeaders,
        exposedHeaders: options.exposedHeaders || defaultExposedHeaders,
      }

    case '*':
    case 'public':
      return {
        origin: '*',
        allowedHeaders: options.allowedHeaders || defaultAllowedHeaders,
        exposedHeaders: options.exposedHeaders || defaultExposedHeaders,
      }

    case 'default':
    default:
      return {
        origin: defaultOrigin,
        allowedHeaders: options.allowedHeaders || defaultAllowedHeaders,
        exposedHeaders: options.exposedHeaders || defaultExposedHeaders,
      }
  }
}

export const defaultOrigin = [
  /https?:\/\/localhost(:\d{4,6})?/,
  /https?:\/\/127\.0\.0\.1(:\d{4,6})?/,
  /https?:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d{4,6})?/,
  /https:\/\/([a-zA-Z0-9\-_]+\.)*dcl\.gg/,
  /https:\/\/([a-zA-Z0-9\-_]+\.)*decentraland\.systems/,
  /https:\/\/([a-zA-Z0-9\-_]+\.)*decentraland\.today/,
  /https:\/\/([a-zA-Z0-9\-_]+\.)*decentraland\.zone/,
  /https:\/\/([a-zA-Z0-9\-_]+\.)*decentraland\.org/,
  /https:\/\/([a-zA-Z0-9\-_]+\.)*decentraland\.net/,
  /https:\/\/([a-zA-Z0-9\-_]+\.)*decentraland\.co/,
  /https:\/\/([a-zA-Z0-9\-_]+\.)*decentraland\.io/,
  /https:\/\/([a-zA-Z0-9\-_]+\.)*manaland\.cn/,
  /https:\/\/decentraland\.github\.io/,
]

export const defaultAllowedHeaders = [
  'Content-Type',
  'Authorization',
  'X-API-Key',
  'X-Identity-Auth-Chain-0',
  'X-Identity-Auth-Chain-1',
  'X-Identity-Auth-Chain-2',
  'X-Identity-Timestamp',
  'X-Identity-Metadata',
]

export const defaultExposedHeaders = [
  'ETag',
  'Cache-Control',
  'Content-Language',
  'Content-Type',
  'Expires',
  'Last-Modified',
  'Pragma',
]
