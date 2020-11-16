import glob from 'glob'
import { Router } from 'express'
import { resolve } from 'path'
import redirect from './redirect'
import file from './file'

export type FilesystemHandleOptions = {
  indexFile: string,
  notFoundFile: string,
}

function filesystemOptions(value: string | Partial<FilesystemHandleOptions>): FilesystemHandleOptions {

  const options = typeof value === 'string' ? { notFoundFile: value } : value

  return {
    indexFile: 'index.html',
    notFoundFile: '404.html',
    ...options
  }
}

export default function filesystem(path: string, notFoundPage: string | Partial<FilesystemHandleOptions>) {
  const router = Router()
  const options = filesystemOptions(notFoundPage)
  const indexFile = '/' + options.indexFile
  const cwd = resolve(process.cwd(), path)
  const files = new Set(glob.sync('**/*', { cwd, nodir: true }))

  for (const filepath of files.values()) {
    const webpath = '/' + filepath // => /en/index.html

    if (webpath.endsWith(indexFile)) {
      const basepath = webpath.slice(0, -10)
      router.get(webpath, redirect(basepath)) // redirect /en/index.html => /en/
      router.get(basepath, file(resolve(cwd, filepath))) // load /en/index.html on /en/
    } else {
      router.get(webpath, file(resolve(cwd, filepath))) // load /en/other.html
    }
  }

  router.use(file(resolve(cwd, options.notFoundFile), 404))
  return router
}