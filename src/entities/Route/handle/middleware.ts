import { NextHandleFunction } from 'connect'
import { NextFunction, Request, Response } from 'express'

import Context from '../context'
import RequestError from '../error'
import handleExpressError from './handleExpressError'
import { AsyncHandler } from './types'

export default function middleware<R extends Request>(
  handler: AsyncHandler<R>
): NextHandleFunction {
  return function (req: Request, res: Response, next: NextFunction) {
    handler(req as R, res, new Context(req, res))
      .then(() => next())
      .catch((err: RequestError) => handleExpressError(err, req, res))
  }
}
