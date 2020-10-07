import glob from 'glob'
import { Router } from 'express'
import { resolve } from 'path'
import redirect from './redirect'
import file from './file'

export default function filesystem(path: string, notFoundPage: string) {
  const router = Router()
  const cwd = resolve(process.cwd(), path)
  const files = new Set(glob.sync('**/*', { cwd, nodir: true }))

  for (const filepath of files.values()) {
    const webpath = '/' + filepath // => /en/index.html

    if (webpath.endsWith('/index.html')) {
      const basepath = webpath.slice(0, -10)
      router.get(webpath, redirect(basepath)) // redirect /en/index.html => /en/
      router.get(basepath, file(resolve(cwd, filepath))) // load /en/index.html on /en/
    } else {
      router.get(webpath, file(resolve(cwd, filepath))) // load /en/other.html
    }
  }

  router.use(file(resolve(cwd, notFoundPage), 404))
  return router
}