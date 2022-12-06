import { sep } from 'path'

import minimatch from 'minimatch'

import { Response } from './types'
import {
  createFileRedirectHandler,
  createGlobRouter,
  createHandlerFromResponse,
} from './utils'
import {
  WebsiteSecurityOptions,
  WebsiteStatusOptions,
  readWebsiteFile,
} from './website'

export const GATSBY_INDEX_FILE = 'index.html'
export const GATSBY_NOT_FOUND_FILE = '404.html'
export default function createGatsbyRouter(
  dir: string,
  options: WebsiteSecurityOptions = {}
) {
  const router = createGlobRouter(dir, '**/*', (router, file) => {
    if (file === GATSBY_INDEX_FILE || file.endsWith(sep + GATSBY_INDEX_FILE)) {
      const target = '/' + file.slice(0, -GATSBY_INDEX_FILE.length)

      // /index.html => /
      // /en/index.html => /en/
      router.get(file, createFileRedirectHandler(target))

      // serve /index.html at /
      // serve /en/index.html at /en/
      router.get(
        target,
        createHandlerFromResponse(readGatsbyFile(dir, file, options))
      )
    } else {
      router.get(
        '/' + file,
        createHandlerFromResponse(readGatsbyFile(dir, file, options))
      )
    }
  })

  router.use(
    createHandlerFromResponse(
      readGatsbyFile(dir, GATSBY_NOT_FOUND_FILE, { status: 404 })
    )
  )
  return router
}

/**
 * Read a file and applys a cache-control header following gatsby recomendations: https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/caching/
 */
export async function readGatsbyFile(
  base: string,
  path: string,
  options: WebsiteSecurityOptions & WebsiteStatusOptions = {}
): Promise<Response> {
  const file = await readWebsiteFile(base, path, options)
  return addGastbyCacheHeaders(file, path)
}

/**
 * Add Gatsby cache headers
 */
export function addGastbyCacheHeaders(file: Response, path: string): Response {
  if (file.status === 200 && isGatsbyImmutableFile(path)) {
    return Response.merge(file, {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    })
  }

  return Response.merge(file, {
    headers: { 'cache-control': 'public, max-age=0, must-revalidate' },
  })
}

export function isGatsbyImmutableFile(path: string): boolean {
  return GATSBY_IMMUTABLE_FILES.some((pattern) => {
    return new RegExp(pattern).test(path)
  })
}

const GATSBY_IMMUTABLE_FILES = [
  new minimatch.Minimatch('static/*').makeRe(),
  new minimatch.Minimatch('static/**/*').makeRe(),
  /^workbox-[a-f0-9]{8}\.js(\.map|\.LICENSE\.txt)?$/gi,
  /^component---src-pages-.*-[a-f0-9]{20}\.js(\.map|\.LICENSE\.txt)?$/gi,
  /^(app|commons|polyfill|framework|webpack-runtime)-[a-f0-9]{20}\.js(\.map|\.LICENSE\.txt)?$/gi,
  /^[a-f0-9]+-[a-f0-9]{20}\.js(\.map|\.LICENSE\.txt)?$/gi,
  /^styles\.[a-f0-9]{20}\.css$/gi,
]
