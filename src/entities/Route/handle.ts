import { Request, Response, NextFunction } from "express";
import { NextHandleFunction } from "connect";
import Context from "./context";
import RequestError from "./error";
import isStream from "../../utils/stream/isStream";

export type AsyncHandler = (req: Request & any, res: Response & any, ctx: Context) => Promise<any> | any

export default handleAPI;

export function handleAPI(handler: AsyncHandler) {
  return handleIncommingMessage(handler, (data, _req, res) => {
    res.json({ ok: true, data })
  })
}

export function handleJSON(handler: AsyncHandler) {
  return handleIncommingMessage(handler, (data, _req, res) => {
    res.json(data)
  })
}

export function handleRaw(handler: AsyncHandler, type?: string) {
  return handleIncommingMessage(
    handler,
    (data, _req, res) => {
      if (type) {
        res.type(type)
      }

      res.send(data)
    }
  )
}

export function handleExpressError(err: RequestError, req: Request, res: Response) {
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

  console.error(
    `error executing request ${req.method} ${req.path} : `,
    process.env.NODE_ENV === 'production' && JSON.stringify(data) || data
  );

  if (!res.headersSent) {
    res.status(err.statusCode || RequestError.InternalServerError)
  }

  if (!res.writableFinished) {
    res.json(RequestError.toJSON(err))
  }
}

function handleIncommingMessage(
  handler: AsyncHandler,
  onSuccess: (data: any, req: Request, res: Response) => void
) {
  return function (req: Request, res: Response) {
    handler(req, res, new Context(req, res))
      .then(function handleResponseOk(data: any) {
        if (!res.headersSent) {
          res.status(defaultStatusCode(req))
        }

        if (!res.writableFinished && res !== data) {
          if (isStream(data)) {
            return data.pipe(res)
          } else {
            onSuccess(data, req, res)
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
export async function useMiddlaware(middlaware: NextHandleFunction, req: Request, res: Response) {
  return new Promise<void>((resolve, reject) => {
    try {
      middlaware(req, res, (err?: any) => { err ? reject(err) : resolve() })
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