import { Router } from 'express'
import bodyParser from 'body-parser'
import expressCors from 'cors'
import handle, { middleware } from './handle';
import env from '../../utils/env';
import { RouterHandler, RoutesOptions, createCorsOptions, CorsOptions } from './types';

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

export function logger() {
  return middleware(async (req, res) => {
    const start = Date.now()

    res.on('close', function requestLogger() {
      const data: Record<string, any> = {
        status: res.statusCode,
        time: (Date.now() - start) / 1000,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        auth: req.auth
      }

      console.log(`[${req.method}] ${req.path} ${JSON.stringify(data)}`)
    })
  })
}