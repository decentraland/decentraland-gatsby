import { Response } from './types'
import { addWebsiteSecurityHeaders } from './website'

const BASE_RESPONSE: Response = {
  status: 200,
  headers: {},
  body: Buffer.alloc(0),
}

const SECURE_RESPONSE = {
  status: 200,
  headers: {
    'content-security-policy':
      "default-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; child-src 'self' https:; connect-src 'self' https: wss:; font-src 'self' https: data:; form-action 'self'; frame-src 'self' https:; img-src https: 'self' data:; manifest-src 'self'; media-src 'self'; prefetch-src 'self' https: data:; style-src 'self' 'unsafe-inline' https: data:; worker-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    'referrer-policy': 'strict-origin-when-cross-origin',
    'strict-transport-security': 'max-age=15552000; includeSubDomains; preload',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'x-xss-protection': '1; mode=block',
  },
  body: Buffer.alloc(0),
}

describe('addSecurityHeaders', () => {
  test(`should add securoty headers into a request`, () => {
    const request = addWebsiteSecurityHeaders(BASE_RESPONSE)
    expect(request.headers).toEqual(SECURE_RESPONSE.headers)
  })

  test(`should allow users to disabled the default values`, () => {
    const request = addWebsiteSecurityHeaders(BASE_RESPONSE, {
      contentSecurityPolicy: false,
      referrerPolicy: false,
      strictTransportSecurity: false,
      xContentTypeOptions: false,
      xFrameOptions: false,
      xXssProtection: false,
    })
    expect(request.headers).toEqual({})
  })

  test(`should allow users to modify headers some headers`, () => {
    const request = addWebsiteSecurityHeaders(BASE_RESPONSE, {
      contentSecurityPolicy: false,
      xContentTypeOptions: false,
      xFrameOptions: false,
      xXssProtection: false,
      strictTransportSecurity: 'custom value',
      referrerPolicy: 'new value',
    })

    expect(request.headers).toEqual({
      'strict-transport-security': 'custom value',
      'referrer-policy': 'new value',
    })
  })

  test(`should allow users to extend headers content-security-policy`, () => {
    const request = addWebsiteSecurityHeaders(BASE_RESPONSE, {
      referrerPolicy: false,
      strictTransportSecurity: false,
      xContentTypeOptions: false,
      xFrameOptions: false,
      xXssProtection: false,
      contentSecurityPolicy: {
        scriptSrc: 'https://decentraland.org https://*.decentraland.org',
      },
    })
    expect(request.headers).toEqual({
      'content-security-policy':
        "default-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; child-src 'self' https:; connect-src 'self' https: wss:; font-src 'self' https: data:; form-action 'self'; frame-src 'self' https:; img-src https: 'self' data:; manifest-src 'self'; media-src 'self'; prefetch-src 'self' https: data:; style-src 'self' 'unsafe-inline' https: data:; worker-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://decentraland.org https://*.decentraland.org",
    })
  })
})
