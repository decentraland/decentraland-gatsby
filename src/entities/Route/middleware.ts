import bodyParser from 'body-parser'
import expressCors from 'cors'
import Ddos from 'ddos'
import { Request, Response, Router } from 'express'

import { AuthData } from '../Auth/middleware'
import logger from '../Development/logger'
import RequestError from './error'
import { middleware } from './handle'
import {
  BodyParserOptions,
  CorsOptions,
  DDosOptions,
  createCorsOptions,
} from './types'

export function withBody(options: BodyParserOptions = {}) {
  const router = Router()
  if (options.urlencode !== false) {
    router.use(bodyParser.urlencoded({ extended: false }))
  }

  if (options.json !== false) {
    router.use(bodyParser.json())
  }

  return router
}

export function withCors(options: CorsOptions = {}) {
  return expressCors(createCorsOptions(options))
}

export function withLogs() {
  return middleware(async (req: Request & Partial<AuthData>, res) => {
    const start = Date.now()

    res.on('close', function requestLogger() {
      const data: Record<string, any> = {
        status: res.statusCode,
        time: (Date.now() - start) / 1000,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        auth: req.auth || null,
        metadata: req.authMetadata || null,
      }

      if (req.headers['referer']) {
        data.referer = req.headers['referer']
      }

      logger.log(`[${req.method}] ${req.originalUrl}`, {
        type: 'http',
        method: req.method,
        url: req.originalUrl,
        ...data,
      })
    })
  })
}

export function withDDosProtection(options: Partial<DDosOptions> = {}) {
  const config: Partial<DDosOptions> & { errormessage: string } = {
    checkinterval: 5,
    limit: 500,
    ...options,
    errormessage: JSON.stringify(
      RequestError.toJSON(
        new RequestError('Too many requests', RequestError.TooManyRequests)
      )
    ),
  }
  const protection = new Ddos(config)
  return protection.express
}

export function withSecurityHeaders() {
  return middleware((req: Request, res: Response) => {
    res.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubdomains; preload'
    )
    res.set('X-Content-Type-Options', 'nosniff')
    res.set('X-Frame-Options', 'DENY')
    res.set('X-XSS-Protection', '1; mode=block')
    res.set('Referrer-Policy', 'no-referrer, strict-origin-when-cross-origin')

    const host = req.hostname
    const tld = host.split('.').slice(-2).join('.')
    const scriptPolicies = Array.from(
      new Set([
        `'self'`,
        `'unsafe-inline'`,
        `'unsafe-eval'`,
        `https://${tld}`,
        `https://*.${tld}`,
        'https://decentraland.org',
        'https://*.decentraland.org',
        'https://www.google-analytics.com',
        'https://ajax.cloudflare.com',
        // 'https://www.googletagmanager.com', disabled
        // 'https://cdn.rollbar.com',
        // 'https://a.klaviyo.com', deprecated
        // 'https://widget.intercom.io', disabled
        // 'https://js.intercomcdn.com', disabled
        // 'https://connect.facebook.net', deprecated
      ])
    ).join(' ')

    res.set(
      'Content-Security-Policy',
      [
        `default-src 'none'`,
        `base-uri 'self'`,
        `form-action 'self'`,
        `manifest-src 'self'`,
        `media-src 'self'`,
        `worker-src 'self'`,
        `script-src ${scriptPolicies}`,
        `font-src https: data:`,
        `prefetch-src https: data:`,
        `style-src 'unsafe-inline' https: data:`,
        `img-src https: data:`,
        `connect-src https:`,
        `frame-src https:`,
        `child-src https:`,
        `object-src 'none'`,
        `frame-ancestors 'none'`,
      ].join('; ')
    )
  })
}
