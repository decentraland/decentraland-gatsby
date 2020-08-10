import express, { Router, Response, Request } from 'express'
import Ddos from 'ddos'
import bodyParser from 'body-parser'
import expressCors from 'cors'
import glob from 'glob'
import { cacheSeconds } from 'route-cache'
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
  let data: Buffer | null = null
  return middleware(async (req, res: Response) => {
    if (!data) {
      data = await promisify(readFile)(path)
    }

    res
      .status(status)
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

export function filesystem(path: string, notFoundPage: string) {
  const router = Router()
  const cwd = resolve(process.cwd(), path)
  const notFoundPath = resolve(cwd, notFoundPage)
  const staticFile = express.static(cwd, { maxAge: 1000 * 60 * 60 })
  const staticCache = cacheSeconds(60 * 24 * 30, (req: Request) => req.path)
  const files = glob.sync('**/*', { cwd })

  for (const file of files) {
    router.use('/' + file, staticCache, staticFile)
  }

  router.use(file(notFoundPath, 404))
  return router
}