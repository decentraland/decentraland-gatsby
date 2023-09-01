import { Request } from 'express'

import handleIncommingMessage from './handleIncommingMessage'
import { AsyncHandler, DEFAULT_API_HEADERS } from './types'

export default function handleJSON<R extends Request>(
  handler: AsyncHandler<R>
) {
  return handleIncommingMessage(handler, {
    defaultHeaders: DEFAULT_API_HEADERS,
    type: 'application/json',
  })
}
