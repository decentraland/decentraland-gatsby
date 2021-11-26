import {
  CacheDidUpdateCallbackParam,
  HandlerDidErrorCallbackParam,
  WorkboxPlugin,
} from 'workbox-core/types'

export class ServiceWorkerLogger {
  constructor(private name: string = 'Service Worker') {}

  private prefix(color: string) {
    return [
      ` %c ${this.name} `,
      `font-weight:bold;background:${color};color:white;border-radius:1em`,
      ' ',
    ]
  }

  log(...args: any[]) {
    console.log(...this.prefix('#D94948'), ...args)
  }

  warning(...args: any[]) {
    console.log(...this.prefix('#EBBF41'), ...args)
  }

  error(...args: any[]) {
    console.log(...this.prefix('#3871E0'), ...args)
  }
}

export const logger = new ServiceWorkerLogger()

export class ServiceWorkerLoggerPlugin implements WorkboxPlugin {
  private logger: ServiceWorkerLogger

  constructor(name: string) {
    this.logger = name
      ? new ServiceWorkerLogger(`Service Worker: ${name}`)
      : logger
  }

  async cacheDidUpdate({ cacheName, request }: CacheDidUpdateCallbackParam) {
    this.logger.log(
      `New cache entry into "${cacheName}" for: ${
        request.method
      } ${request.url.toString()}`
    )
  }

  async handlerDidError({ request, error }: HandlerDidErrorCallbackParam) {
    this.logger.error(
      `Error handling requet: ${request.method} ${request.url.toString()}`,
      error
    )
    return undefined
  }
}
