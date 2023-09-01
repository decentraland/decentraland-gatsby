import env from '../../../utils/env'
import Context from '../context'

import type { Request, Response } from 'express'

export type AsyncHandler<R extends Request = Request> = (
  req: R,
  res: Response,
  ctx: Context
) => Promise<any> | any

export const DEFAULT_API_HEADERS: Record<string, string> = {
  'Content-Security-Policy': `default-src 'none'; frame-ancestors 'none'`,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
}

if (env('STRICT_TRANSPORT_SECURITY', 'false') === 'true') {
  DEFAULT_API_HEADERS['Strict-Transport-Security'] = 'max-age=63072000'
}
