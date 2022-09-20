import { IMiddlewareAdapterHandler } from '@well-known-components/interfaces/dist/components/base-component'

import logger from '../../../Development/logger'
import {
  http_request_duration_seconds,
  http_request_size_bytes,
  http_requests_total,
} from '../../metrics'
import ExpressContext from '../context/ExpressContext'
import ErrorResponse from '../response/ErrorResponse'
import Response from '../response/Response'

import type Context from '../context/Context'
import type * as express from 'express'
import type { Writable } from 'stream'

/** http status */

export function status(req: Context, res: Response) {
  if (res.status) {
    return res.status
  }

  switch (req.request.method) {
    case 'PUT':
    case 'POST':
      return Response.Created
    default:
      return Response.Ok
  }
}

/** track http metrics */
export function track(
  request: Pick<express.Request, 'method' | 'baseUrl' | 'route' | 'headers'>,
  response: Pick<Writable, 'on'> & { statusCode: number }
) {
  const labels = {
    method: request.method,
    handler: request.baseUrl + (request.route?.path || ''),
  }

  // metrics
  const finishTimer = http_request_duration_seconds.startTimer(labels)
  response.on('close', () => {
    finishTimer({ code: response.statusCode })
    http_requests_total.inc({ ...labels, code: response.statusCode })
    const contentLength = request.headers['content-length']

    if (contentLength) {
      http_request_size_bytes.observe(
        { ...labels, code: response.statusCode },
        Number(contentLength)
      )
    }
  })
}

/** adapt express router to wnk router */
export function route<R extends Context<{}> = Context<{}>>(
  handler: IMiddlewareAdapterHandler<R, Response>
) {
  return async function (request: express.Request, response: express.Response) {
    track(request, response)

    let res: Response
    const ctx = new ExpressContext(request) as R

    try {
      res = await handler(ctx, async () => ({}))
    } catch (err) {
      logger.error(
        `executing request ${request.method} ${request.originalUrl}`,
        err
      )
      res = ErrorResponse.toResponse(err)
    }

    return response
      .status(status(ctx, res))
      .header(res.headers || {})
      .send(res.body)
  }
}
