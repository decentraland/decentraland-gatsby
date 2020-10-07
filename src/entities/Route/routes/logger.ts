import { Request } from 'express'
import { middleware } from '../handle';

export default function logger() {
  return middleware(async (req: Request & { auth?: any }, res) => {
    const start = Date.now()

    res.on('close', function requestLogger() {
      const data: Record<string, any> = {
        status: res.statusCode,
        time: (Date.now() - start) / 1000,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        auth: req.auth
      }

      console.log(`[${req.method}] ${req.originalUrl} ${JSON.stringify(data)}`)
    })
  })
}
