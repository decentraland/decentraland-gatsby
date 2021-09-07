import { Request, Response, NextFunction } from 'express'
import { NextHandleFunction } from 'connect'
import Context from './context'
import RequestError from './error'
import isStream from '../../utils/stream/isStream'
import {
  http_request_pool_size,
  http_request_duration_seconds,
} from './metrics'
import logger from '../Development/logger'

const DEFAULT_API_HEADERS: Record<string, string> = {
  'Content-Security-Policy': `default-src 'none'; frame-ancestors 'none'`,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
}

if (process.env.STRICT_TRANSPORT_SECURITY === 'true') {
  DEFAULT_API_HEADERS['Strict-Transport-Security'] = 'max-age=63072000'
}

export type AsyncHandler = (
  req: Request & any,
  res: Response & any,
  ctx: Context
) => Promise<any> | any

export default handleAPI

export function handleAPI(handler: AsyncHandler) {
  return handleIncommingMessage(handler, {
    defaultHeaders: DEFAULT_API_HEADERS,
    api: true,
    // onSuccess: (data, _req, res) => {
    //   res.json({ ok: true, data })
    // }
  })
}

export function handleJSON(handler: AsyncHandler) {
  return handleIncommingMessage(handler, {
    defaultHeaders: DEFAULT_API_HEADERS,
    type: 'application/json',
  })
}

export function handleRaw(handler: AsyncHandler, type?: string) {
  return handleIncommingMessage(handler, { type })
}

export function handleExpressError(
  err: RequestError,
  req: Request,
  res: Response
) {
  const data = {
    ...err,
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    auth: (req as any).auth,
    params: (req as any).params,
    query: (req as any).query,
    body: (req as any).body,
  }

  logger.error(`error executing request ${req.method} ${req.path}`, {
    type: 'http',
    ...data,
    error: err,
  })

  if (!res.headersSent) {
    res.status(err.statusCode || RequestError.InternalServerError)
  }

  if (!res.writableFinished) {
    res.json(RequestError.toJSON(err))
  }
}

function handleIncommingMessage(
  handler: AsyncHandler,
  options: Partial<{
    defaultHeaders: Record<string, string>
    api?: boolean
    type?: string
    // onSuccess: (data: any, req: Request, res: Response) => void
  }>
) {
  return function (req: Request, res: Response) {
    const labels = {
      method: req.method,
      handler: req.baseUrl + (req.route?.path || ''),
    }

    http_request_pool_size.inc(labels)
    const endTimer = http_request_duration_seconds.startTimer(labels)
    res.on('close', () => {
      endTimer({ statusCode: res.statusCode })
      http_request_pool_size.dec(labels)
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
      .then(() => handler(req, res, new Context(req, res)))
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

export function middleware(handler: AsyncHandler): NextHandleFunction {
  return function (req: Request, res: Response, next: NextFunction) {
    handler(req, res, new Context(req, res))
      .then(() => next())
      .catch((err: RequestError) => handleExpressError(err, req, res))
  }
}

/** @deprecated */
export async function useMiddlaware(
  middlaware: NextHandleFunction,
  req: Request,
  res: Response
) {
  return new Promise<void>((resolve, reject) => {
    try {
      middlaware(req, res, (err?: any) => {
        err ? reject(err) : resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}

function defaultStatusCode(req: Request) {
  switch (req.method) {
    case 'PATCH':
    case 'POST':
    case 'PUT':
      return 201

    case 'DELETE':
    case 'GET':
    default:
      return 200
  }
}
