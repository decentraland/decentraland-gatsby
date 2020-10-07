import { Router } from 'express'
import bodyParser from 'body-parser'
import { RouterHandler, RoutesOptions } from '../types';
import cors from './cors'

export default function routes(handle: RouterHandler, options: RoutesOptions = {}): Router {
  const router = Router(options)
  router.use(cors(options))
  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(bodyParser.json())
  handle(router)
  return router
}
