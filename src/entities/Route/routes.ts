import { Router, Response, Request } from 'express'
import { createHash } from 'crypto'
import Ddos from 'ddos'
import bodyParser from 'body-parser'
import expressCors from 'cors'
import glob from 'glob'
import { readFile } from 'fs'
import { promisify } from 'util'
import { extname, resolve } from 'path'
import handle, { middleware, toResponseError } from './handle';
import env from '../../utils/env';
import { RouterHandler, RoutesOptions, createCorsOptions, CorsOptions, DDosOptions } from './types';
import RequestError from './error'

const IMAGE = env('IMAGE', `events:${Date.now()}`)
const [image, version] = IMAGE.split(':')

export default function routes(handle: RouterHandler, options: RoutesOptions = {}): Router {
  const router = Router(options)
  router.use(cors(options))
  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(bodyParser.json())
  handle(router)
  return router
}

export function status() {
  return routes((router) => {
    router.get('/status', handle(async () => ({
      image,
      version,
      timestamp: new Date()
    })))
  })
}

export function cors(options: CorsOptions = {}) {
  return expressCors(createCorsOptions(options))
}

export function file(path: string, status: number = 200) {
  let reader: Promise<readonly [Buffer, string]> | null = null
  return middleware(async (req, res: Response) => {
    if (!reader) {
      reader = (async () => {
        const data = await promisify(readFile)(path).catch(() => Buffer.alloc(0))
        const hash = createHash('sha256')
        hash.write(data)
        const etag = hash.digest('hex')
        return [data, etag] as const
      })()
    }

    const [data, etag] = await reader
    res
      .status(status)
      .set('cache-control', 'public, max-age=86400')
      .set('etag', JSON.stringify(etag))
      .type(extname(path))
      .send(data)
  })
}

export function ddos(options: Partial<DDosOptions> = {}) {
  const config: Partial<DDosOptions> & { errormessage: string } = {
    checkinterval: 5,
    limit: 500,
    ...options,
    errormessage: JSON.stringify(toResponseError(
      new RequestError('Too many requests', RequestError.TooManyRequests)
    ))
  }
  const protection = new Ddos(config)
  return protection.express
}

export function logger() {
  return middleware(async (req: Request & { auth?: any }, res) => {
    const start = Date.now()

    res.on('close', function requestLogger() {
      const data: Record<string, any> = {
        status: res.statusCode,
        time: (Date.now() - start) / 1000,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        auth: req.auth
      }

      console.log(`[${req.method}] ${req.originalUrl} ${JSON.stringify(data)}`)
    })
  })
}

export function redirect(to: string, status: number = 302) {
  return (req: Request, res: Response) => {
    res.status(status).redirect(to)
  }
}

export function filesystem(path: string, notFoundPage: string) {
  const router = Router()
  const cwd = resolve(process.cwd(), path)
  const files = new Set(glob.sync('**/*', { cwd, mark: true }))

  for (const filepath of files.values()) {
    if (filepath.endsWith('/')) {
      if (files.has(filepath + 'index.html')) {
        router.get('/' + filepath.slice(0, -1), redirect('/' + filepath))
      }
    } else if (
      filepath === 'index.html' ||
      filepath.endsWith('/index.html')
    ) {
      const response = file(resolve(cwd, filepath))
      router.get('/' + filepath, response)
      router.get('/' + filepath.slice(0, -10), response)
    } else {
      router.get('/' + filepath, file(resolve(cwd, filepath)))
    }
  }

  router.use(file(resolve(cwd, notFoundPage), 404))
  return router
}