import { Request } from 'express'

import { AuthData } from '../../Auth/middleware'
import logger from '../../Development/logger'
import middleware from '../handle/middleware'

export default function withLogs() {
  return middleware(async (req: Request & Partial<AuthData>, res) => {
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
  })
}
