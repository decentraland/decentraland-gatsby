import { Request, Response, NextFunction } from "express";
import { NextHandleFunction } from "connect";
import Context from "./context";
import RequestError from "./error";
import isStream from "../../utils/stream/isStream";

export type AsyncHandler = (req: Request & any, res: Response & any, ctx: Context) => Promise<any> | any

export default function handle(handler: AsyncHandler) {
  return function (req: Request, res: Response) {

    handler(req, res, new Context(req, res))
      .then(function handleResponseBody(data: any) {
        if (!res.headersSent) {
          res.status(defaultStatusCode(req))
        }

        if (!res.writableFinished && res !== data) {
          if (isStream(data)) {
            return data.pipe(res)
          } else {
            return res.json({ ok: true, data })
          }
        }
      })
      .catch((err: RequestError) => handleResponseError(req, res, err))
  }
}

export function middleware(handler: AsyncHandler): NextHandleFunction {
  return function (req: Request, res: Response, next: NextFunction) {
    handler(req, res, new Context(req, res))
      .then(() => next())
      .catch((err: RequestError) => handleResponseError(req, res, err))
  }
}

export async function useMiddlaware(middlaware: NextHandleFunction, req: Request, res: Response) {
  return new Promise<void>((resolve, reject) => {
    try {
      middlaware(req, res, (err?: any) => { err ? reject(err) : resolve() })
    } catch (error) {
      reject(error)
    }
  })
}

function handleResponseError(req: Request, res: Response, err: RequestError) {
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

  console.error(`error executing request ${req.method} ${req.path} : `, process.env.NODE_ENV === 'production' && JSON.stringify(data) || data);

  if (!res.headersSent) {
    res.status(err.statusCode || RequestError.InternalServerError)
  }

  if (!res.writableFinished) {
    res.json(toResponseError(err))
  }
}

export function toResponseError(err: RequestError) {
  const result: any = {
    ok: false,
    error: err.message,
  }

  if (err.data) {
    result.data = err.data
  }

  if (process.env.NODE_ENV === 'development') {
    result.stack = err.stack
  }

  return result
}

function defaultStatusCode(req: Request) {
  switch (req.method) {
    case 'PATCH':
    case 'POST':
      return 201

    case 'DELETE':
    case 'GET':
    default:
      return 200
  }
}