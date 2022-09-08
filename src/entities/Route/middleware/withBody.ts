import bodyParser from 'body-parser'
import { Router } from 'express'

import { BodyParserOptions } from '../types'

export default function withBody(options: BodyParserOptions = {}) {
  const router = Router()
  if (options.urlencode !== false) {
    router.use(bodyParser.urlencoded({ extended: false }))
  }

  if (options.json !== false) {
    router.use(bodyParser.json())
  }

  return router
}
