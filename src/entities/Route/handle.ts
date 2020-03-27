import { Request, Response, NextFunction } from "express";
import RequestError from "./error";

export type AsyncHandler = (req: Request & any, res: Response & any) => Promise<any> | any

export default function handle(handler: AsyncHandler) {
  return function (req: Request, res: Response) {

    handler(req, res)
      .then(function handleResponseBody(data: any) {
        if (!res.headersSent) {
          res.status(defaultStatusCode(req))
        }

        if (!res.writableFinished) {
          res.json({ ok: true, data })
        }
      })
      .catch((err: RequestError) => handleResponseError(res, err))
  }
}

export function middleware(handler: AsyncHandler) {
  return function (req: Request, res: Response, next: NextFunction) {

    handler(req, res)
      .then(() => next())
      .catch((err: RequestError) => handleResponseError(res, err))
  }
}

function handleResponseError(res: Response, err: RequestError) {
  console.error(err);

  if (!res.headersSent) {
    res.status(err.statusCode || RequestError.InternalServerError)
  }

  if (!res.writableFinished) {
    res.json(toResponseError(err))
  }
}

function toResponseError(err: RequestError) {
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