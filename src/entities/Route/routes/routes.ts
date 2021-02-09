import { Router } from 'express'
import bodyParser from 'body-parser'
import { RouterHandler, RoutesOptions } from '../types';
import { withLogs, withCors } from '../middleware';
import { withMetrics } from '../../Prometheus/middleware';

export default function routes(handle: RouterHandler, options: RoutesOptions = {}): Router {
  const router = Router(options)
  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(bodyParser.json())

  router.use(withCors(options))

  if (options.disableLogs !== true) {
    router.use(withLogs())
  }

  if (options.disableMetrics !== true) {
    router.use(withMetrics())
  }

  handle(router)
  return router
}
