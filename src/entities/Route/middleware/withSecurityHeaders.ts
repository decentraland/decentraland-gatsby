import { Request, Response } from 'express'

import middleware from '../handle/middleware'

export default function withSecurityHeaders() {
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
        'https://verify.walletconnect.com',
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
