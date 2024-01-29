import {
  http_request_duration_seconds,
  http_request_size_bytes,
  http_requests_total,
} from '../metrics'

import type * as e from 'express'

export enum HttpMetricsHandler {}

export type WithHttpMetricsOptions = {
  /**
   * Defines how to track the handler label
   *
   * - if `true` will use the route path as handler
   * - if `false` will use the baseUrl as path
   * - if `string` will use the that as the static name for the handler
   *
   * @default true
   */
  handler?: true | false | string
}

/**
 *
 * @param options metrics tracking options
 * @returns
 */
export default function withHttpMetrics(
  options: WithHttpMetricsOptions = {}
): e.Handler {
  return (req, res, next) => {
    const labels = {
      method: req.method,
      handler: getHandlerName(req, options),
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

    next()
  }
}

function getHandlerName(req: e.Request, options: WithHttpMetricsOptions = {}) {
  if (typeof options.handler === 'string') {
    return options.handler
  }

  if (options.handler === false) {
    req.baseUrl
  }

  return req.baseUrl + (req.route?.path || '/')
}
