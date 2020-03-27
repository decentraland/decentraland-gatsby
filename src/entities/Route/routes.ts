import { Router } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import handle, { middleware } from './handle';
import env from '../../utils/env';
import { RouterHandler, RoutesOptions, createCorsOptions } from './types';

const IMAGE = env('IMAGE', `unknown:${Date.now()}`)
const [image, version] = IMAGE.split(':')

export default function routes(handle: RouterHandler, options: RoutesOptions = {}): Router {
  const router = Router(options)
  router.use(cors(createCorsOptions(options)))
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

export function logger() {
  return middleware(async (req, res) => {
    const start = Date.now()

    res.on('close', function requestLogger() {
      const diff = (Date.now() - start) / 1000
      console.log(`[${req.method}] ${req.path} (status: ${res.statusCode}, time: ${diff.toFixed(3)}s)`)
    })
  })
}