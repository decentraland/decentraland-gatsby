import { createETag, readFileFromMemory } from './file'
import { Response } from './types'
import { createGlobRouter, createHandlerFromResponse } from './utils'

const NOT_FOUND_BODY = Buffer.from('Not found')
const NOT_FOUND_ETAG = createETag(NOT_FOUND_BODY)
const NOT_FOUND_RESPONSE = {
  status: 404,
  headers: {
    'content-type': 'text/plain',
    'cache-control': 'public, max-age=0, must-revalidate',
    etag: NOT_FOUND_ETAG,
  },
  body: NOT_FOUND_BODY,
}

export type WebsiteFilesOptions = {
  /**
   * If file doesn't exists it will continue with the next router
   * @default false
   */
  continueIfNotFound?: boolean

  /**
   * Not found file resopnse, if not set a plain/text response will be
   * provided instead
   */
  notFoundFile?: string
}

export default function createWebsiteRouter(
  dir: string,
  options: WebsiteSecurityOptions & WebsiteFilesOptions = {}
) {
  const router = createGlobRouter(dir, '**/*', (router, file) => {
    router.get(
      '/' + file,
      createHandlerFromResponse(readWebsiteFile(dir, file, options))
    )
  })

  if (options.continueIfNotFound === true) {
    if (options.notFoundFile) {
      router.use(
        createHandlerFromResponse(
          readWebsiteFile(dir, options.notFoundFile, options)
        )
      )
    } else {
      const notFound = addWebsiteSecurityHeaders(NOT_FOUND_RESPONSE, options)
      router.use(createHandlerFromResponse(notFound))
    }
  }

  return router
}

export async function readWebsiteFile(
  base: string,
  path: string,
  options: WebsiteSecurityOptions & WebsiteStatusOptions = {}
): Promise<Response> {
  let result = await readFileFromMemory(base, path)
  result = overwriteWebsiteStatus(result, options)
  result = addWebsiteSecurityHeaders(result, options)
  return result
}

export type WebsiteStatusOptions = Partial<{
  /**
   * Overwrite the response status
   */
  status: number
}>

export function overwriteWebsiteStatus<R extends Response>(
  response: R,
  options: WebsiteStatusOptions = {}
) {
  if (!options.status) {
    return response
  }

  return { ...response, status: options.status }
}

export type WebsiteSecurityOptions = Partial<{
  /**
   * Disabled X-XSS-Protection
   * The HTTP X-XSS-Protection response header is a feature of Internet Explorer, Chrome and
   * Safari that stops pages from loading when they detect reflected cross-site scripting (XSS) attacks.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
   */
  xXssProtection: false

  /**
   * Disabled X-Frame-Options
   * The X-Frame-Options HTTP response header can be used to indicate whether or not a browser
   * should be allowed to render a page in a <frame>, <iframe>, <embed> or <object>. Sites can
   * use this to avoid click-jacking attacks, by ensuring that their content is not embedded into
   * other sites.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
   */
  xFrameOptions: false

  /**
   * Disabled X-Content-Type-Options
   *
   * The X-Content-Type-Options response HTTP header is a marker used by the server to indicate
   * that the MIME types advertised in the Content-Type headers should be followed and not be
   * changed. The header allows you to avoid MIME type sniffing by saying that the MIME types are
   * deliberately configured.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
   */
  xContentTypeOptions: false

  /**
   * Disabled or modify Referrer-Policy
   *
   * he Referrer-Policy HTTP header controls how much referrer information (sent with the
   * Referer header) should be included with requests. Aside from the HTTP header
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
   */
  referrerPolicy: false | string

  /**
   * Disabled or modify Strict-Transport-Security
   *
   * The HTTP Strict-Transport-Security response header (often abbreviated as HSTS) informs
   * browsers that the site should only be accessed using HTTPS, and that any future attempts
   * to access it using HTTP should automatically be converted to HTTPS.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
   */
  strictTransportSecurity: false | string

  /**
   * Disabled or extends Content-Security-Policy
   *
   * The HTTP Content-Security-Policy response header allows web site administrators to control
   * resources the user agent is allowed to load for a given page. With a few exceptions, policies
   * mostly involve specifying server origins and script endpoints. This helps guard against
   * cross-site scripting attacks.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
   */
  contentSecurityPolicy:
    | false
    | Partial<{
        baseUri: false | string | string[]
        childSrc: false | string | string[]
        connectSrc: false | string | string[]
        fontSrc: false | string | string[]
        formAction: false | string | string[]
        frameSrc: false | string | string[]
        imgSrc: false | string | string[]
        manifestSrc: false | string | string[]
        mediaSrc: false | string | string[]
        prefetchSrc: false | string | string[]
        styleSrc: false | string | string[]
        workerSrc: false | string | string[]
        scriptSrc: false | string | string[]
      }>

  /**
   * Disabled or extends Permissions-Policy
   *
   * The HTTP Permissions-Policy (before know as Feature-Policy) header provides a mechanism to allow and deny
   * the use of browser features in its own frame, and in content within any <iframe> elements in the document.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
   */
  permissonPolicy: false | {}

  /**
   * Disabled or extends Cross-Origin-Opener-Policy
   *
   * The HTTP Cross-Origin-Opener-Policy (COOP) response header allows a website to control whether a new top-level
   * document, opened using Window.open() or by navigating to a new page, is opened in the same
   * browsing context group (BCG) or in a new browsing context group.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
   */
  crossOriginOpenerPolicy: false | string
}>

export function addWebsiteSecurityHeaders<R extends Response>(
  response: R,
  options: WebsiteSecurityOptions = {}
) {
  const contentSecurityPolicy =
    options.contentSecurityPolicy === false
      ? false
      : options.contentSecurityPolicy || {}

  return Response.merge(
    response,
    options.xFrameOptions !== false && {
      headers: { 'x-frame-options': 'DENY' },
    },
    options.xContentTypeOptions !== false && {
      headers: { 'x-content-type-options': 'nosniff' },
    },
    options.xXssProtection !== false && {
      headers: { 'x-xss-protection': '1; mode=block' },
    },
    options.strictTransportSecurity !== false && {
      headers: {
        'strict-transport-security':
          typeof options.strictTransportSecurity === 'string'
            ? options.strictTransportSecurity
            : 'max-age=15552000; includeSubDomains; preload',
      },
    },
    options.referrerPolicy !== false && {
      headers: {
        'referrer-policy':
          typeof options.referrerPolicy === 'string'
            ? options.referrerPolicy
            : 'strict-origin-when-cross-origin',
      },
    },
    contentSecurityPolicy !== false && {
      headers: {
        'content-security-policy': [
          `default-src 'none'`,
          `frame-ancestors 'none'`,
          `object-src 'none'`,
          toContentSecurityPolicy(
            `base-uri 'self'`,
            contentSecurityPolicy.baseUri
          ),
          toContentSecurityPolicy(
            `child-src 'self' https:`,
            contentSecurityPolicy.childSrc
          ),
          toContentSecurityPolicy(
            `connect-src 'self' https: wss:`,
            contentSecurityPolicy.connectSrc
          ),
          toContentSecurityPolicy(
            `font-src 'self' https: data:`,
            contentSecurityPolicy.fontSrc
          ),
          toContentSecurityPolicy(
            `form-action 'self'`,
            contentSecurityPolicy.formAction
          ),
          toContentSecurityPolicy(
            `frame-src 'self' https:`,
            contentSecurityPolicy.frameSrc
          ),
          toContentSecurityPolicy(
            `img-src https: 'self' data:`,
            contentSecurityPolicy.imgSrc
          ),
          toContentSecurityPolicy(
            `manifest-src 'self'`,
            contentSecurityPolicy.manifestSrc
          ),
          toContentSecurityPolicy(
            `media-src 'self'`,
            contentSecurityPolicy.mediaSrc
          ),
          toContentSecurityPolicy(
            `prefetch-src 'self' https: data:`,
            contentSecurityPolicy.prefetchSrc
          ),
          toContentSecurityPolicy(
            `style-src 'self' 'unsafe-inline' https: data:`,
            contentSecurityPolicy.styleSrc
          ),
          toContentSecurityPolicy(
            `worker-src 'self'`,
            contentSecurityPolicy.workerSrc
          ),
          toContentSecurityPolicy(
            `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
            contentSecurityPolicy.scriptSrc
          ),
        ]
          .filter(Boolean)
          .join('; '),
      },
    },
    options.crossOriginOpenerPolicy !== false && {
      headers: {
        'cross-origin-opener-policy':
          typeof options.crossOriginOpenerPolicy === 'string'
            ? options.crossOriginOpenerPolicy
            : 'same-origin',
      },
    }
  )
}

function toContentSecurityPolicy(
  base: string,
  value?: false | string | string[]
) {
  if (value === false) {
    return false
  }

  if (!value) {
    return base
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return base
    }

    return base + ' ' + value.join(' ')
  }

  return base + ' ' + value
}

// function toPermissionPolicy(value?: false | '*' | string[]): string {
//   if (Array.isArray(value)) {
//     return `=(${value.map(domain => `"${domain}"`).join(' ')})`
//   }

// return Object.keys(options).map(key => {
//   const value = options[key] as boolean | '*' | string[]
//   switch (value) {
//     case false:
//       return key + '=()'
//     case true:
//       return key + '=(self)'
//     case '*':
//       return key + '=*'
//     default:
//       return key + '=(' + value.map(domain => `"${domain}"`).join(' ') + ')'
//   }
// }).join(', ')
// }
