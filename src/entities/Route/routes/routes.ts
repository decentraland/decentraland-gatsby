import { Router } from 'express'

import { RouterHandler, RoutesOptions } from '../types'

export default function routes(
  handle: RouterHandler,
  options: RoutesOptions = {}
): Router {
  const router = Router(options)
  handle(router)
  return router
}
