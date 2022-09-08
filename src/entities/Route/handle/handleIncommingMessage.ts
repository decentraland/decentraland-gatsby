import { Request, Response } from 'express'

import isStream from '../../../utils/stream/isStream'
import Context from '../context'
import RequestError from '../error'
import {
  http_request_duration_seconds,
  http_request_size_bytes,
  http_requests_total,
} from '../metrics'
import handleExpressError from './handleExpressError'
import { AsyncHandler } from './types'
import { defaultStatusCode } from './utils'

export default function handleIncommingMessage<R extends Request>(
  handler: AsyncHandler<R>,
  options: Partial<{
    defaultHeaders: Record<string, string>
    api?: boolean
    type?: string
  }>
) {
  return function (req: Request, res: Response) {
    const labels = {
      method: req.method,
      handler: req.baseUrl + (req.route?.path || ''),
    }

    const endTimer = http_request_duration_seconds.startTimer(labels)

    res.on('close', () => {
      endTimer({ code: res.statusCode })

      http_requests_total.inc({ ...labels, code: res.statusCode })

      if (req.headers['content-length']) {
        http_request_size_bytes.observe(
          { ...labels, code: res.statusCode },
          Number(req.headers['content-length'])
        )
      }
    })

    Promise.resolve()
      .then(() => {
        if (options.defaultHeaders) {
          res.set(options.defaultHeaders)
        }

        if (options.api) {
          res.type('application/json')
        } else if (options.type) {
          res.type(options.type)
        }
      })
      .then(() => handler(req as R, res, new Context(req, res)))
      .then(function handleResponseOk(data: any) {
        if (!res.headersSent) {
          res.status(defaultStatusCode(req))
        }

        if (!res.writableFinished && res !== data) {
          if (isStream(data)) {
            return data.pipe(res)
          } else {
            if (options.api) {
              res.json({ ok: true, data })
            } else if (options.type === 'application/json') {
              res.json(data)
            } else {
              res.send(data)
            }

            return data
          }
        }
      })
      .catch((err: RequestError) => handleExpressError(err, req, res))
  }
}
