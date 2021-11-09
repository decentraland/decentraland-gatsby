import type { Request } from 'express'
import handle, { AsyncHandler } from '../handle'

export default function single<R extends Request>(handler: AsyncHandler<R>) {
  let loaders = new Map<string, Promise<any>>()

  return handle(async (req, res, ctx) => {
    if (loaders.has(req.path)) {
      return loaders.get(req.path)
    }

    const loader = handler(req as R, res, ctx)
      .then((response: any) => {
        loaders.delete(req.path)
        return response
      })
      .catch((err: Error) => {
        loaders.delete(req.path)
        return Promise.reject(err)
      })

    loaders.set(req.path, loader)
    return loader
  })
}
