import { Request } from 'express'

import handleIncommingMessage from './handleIncommingMessage'
import { AsyncHandler } from './types'

export default function handleRaw<R extends Request>(
  handler: AsyncHandler<R>,
  type?: string
) {
  return handleIncommingMessage(handler, { type })
}
