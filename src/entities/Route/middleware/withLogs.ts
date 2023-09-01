import { AuthData } from '../../Auth/middleware'
import logger from '../../Development/logger'

import type { Handler, Request } from 'express'

export default function withLogs(): Handler {
  return (req: Request & AuthData, res, next) => {
    const start = Date.now()

    res.on('close', function requestLogger() {
      const data: Record<string, any> = {
        status: res.statusCode,
        time: (Date.now() - start) / 1000,
        ip:
          req.headers['x-forwarded-for'] ||
          req.socket.remoteAddress ||
          req.connection.remoteAddress,
        includeUserAgent: false,
        auth: req.auth || null,
        metadata: req.authMetadata || null,
      }

      if (req.headers['referer']) {
        data.referer = req.headers['referer']
      }

      logger.log(`[${req.method}] ${req.originalUrl}`, {
        type: 'http',
        method: req.method,
        url: req.originalUrl,
        ...data,
      })
    })

    next()
  }
}
