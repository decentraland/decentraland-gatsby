import { Request } from 'express'
import Ddos from 'ddos'
import expressCors from 'cors'
import { middleware } from './handle';
import { DDosOptions, createCorsOptions, CorsOptions } from './types';
import RequestError from './error'

export function withCors(options: CorsOptions = {}) {
  return expressCors(createCorsOptions(options))
}

export function withLogs() {
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

export function withDDosProtection(options: Partial<DDosOptions> = {}) {
  const config: Partial<DDosOptions> & { errormessage: string } = {
    checkinterval: 5,
    limit: 500,
    ...options,
    errormessage: JSON.stringify(RequestError.toJSON(
      new RequestError('Too many requests', RequestError.TooManyRequests)
    ))
  }
  const protection = new Ddos(config)
  return protection.express
}
