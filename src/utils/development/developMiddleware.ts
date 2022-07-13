import { createProxyMiddleware } from 'http-proxy-middleware'

import type * as express from 'express'

export type DevelopMiddlewareConfig = {
  prefix: string
  url: string
}

export type DevelopMiddlewarePaths =
  | DevelopMiddlewareConfig
  | DevelopMiddlewareConfig[]

export default function developMiddleware(paths: DevelopMiddlewarePaths) {
  const configs = Array.isArray(paths) ? paths : [paths]
  return (app: express.Application) => {
    for (const config of configs) {
      app.use(
        config.prefix,
        createProxyMiddleware({
          target: config.url,
          secure: !config.url.startsWith('https://localhost:'),
        })
      )
    }
  }
}
