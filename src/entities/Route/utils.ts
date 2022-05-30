import { AsyncHandler } from './handle'

export function oncePerRequest<H extends AsyncHandler<any>>(handler: H): H {
  const key = Symbol(`@cache`)
  return async function oncePerRequestHandler(req, res, ctx) {
    if (req[key]) {
      return req[key]
    }

    req[key] = await handler(req, res, ctx)
    return req[key]
  } as H
}
