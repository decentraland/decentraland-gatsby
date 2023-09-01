import { Request } from 'express'

import handleIncommingMessage from './handleIncommingMessage'
import { AsyncHandler, DEFAULT_API_HEADERS } from './types'

export default function handleAPI<R extends Request>(handler: AsyncHandler<R>) {
  return handleIncommingMessage(handler, {
    defaultHeaders: DEFAULT_API_HEADERS,
    api: true,
    // onSuccess: (data, _req, res) => {
    //   res.json({ ok: true, data })
    // }
  })
}
