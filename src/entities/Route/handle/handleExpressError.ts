import { Request, Response } from 'express'

import logger from '../../Development/logger'
import RequestError from '../error'

export default function handleExpressError(
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

  logger.error(
    `error executing request ${req.method} ${req.baseUrl + req.path}`,
    {
      type: 'http',
      ...data,
      error: err,
    }
  )

  if (!res.headersSent) {
    res.status(err.statusCode || RequestError.InternalServerError)
  }

  if (!res.writableFinished) {
    res.json(RequestError.toJSON(err))
  }
}
