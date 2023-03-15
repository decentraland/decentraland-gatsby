import { resolve, sep } from 'path'

import e from 'express'
import { sync } from 'glob'

import RequestError from '../../error'
import handleExpressError from '../../handle/handleExpressError'
import { withHttpMetrics } from '../../middleware'
import withLogs from '../../middleware/withLogs'
import { Response } from './types'

export function resolvePath(basePath: string, path: string) {
  if (!basePath.endsWith(sep)) {
    basePath += sep
  }

  const result = resolve(basePath, path)
  if (!result.startsWith(basePath)) {
    return null
  }

  return result
}

export function createHandlerFromResponse(
  response: Response | Promise<Response>
): e.Handler {
  return (req: e.Request, res: e.Response) => {
    Promise.resolve(response)
      .then((response: Response) => {
        for (const [key, value] of Object.entries(response.headers)) {
          res.header(key, value)
        }
        res.status(response.status)
        if (response.body instanceof Buffer) {
          res.send(response.body)
        } else {
          response.body.pipe(res)
        }
      })
      .catch((err: RequestError) => handleExpressError(err, req, res))
  }
}

export function createGlobRouter(
  base: string,
  patter: string,
  iterator: (router: e.Router, match: string) => void
) {
  const router = e.Router()
  router.use(withLogs())
  router.use(withHttpMetrics({ handler: 'filesystem' }))
  const files = sync(patter, { cwd: base, nodir: true })
  for (const file of files) {
    iterator(router, file)
  }
  return router
}

export function createFileRedirectHandler(to: string, status = 302) {
  return function redirect(req: e.Request, res: e.Response) {
    let target = req.baseUrl + to
    const queryPosition = req.originalUrl.indexOf('?')
    if (queryPosition >= 0) {
      target += req.originalUrl.slice(queryPosition)
    }

    res.redirect(target, status)
  }
}
