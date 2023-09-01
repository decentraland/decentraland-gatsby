import env from '../../utils/env'

export type LoggerLevel = 'info' | 'warning' | 'error'
export type LoggerData = Record<string, any> & { level: LoggerLevel }
export type LoggerSubscription = (message: string, data: LoggerData) => any
export type LoggerOptions = { disabled?: boolean }

export class Logger {
  static readonly subscriptions: Map<LoggerLevel, LoggerSubscription[]> =
    new Map()

  static write(message: string, data: LoggerData) {
    const method =
      data.level === 'error'
        ? 'error'
        : data.level === 'warning'
        ? 'warn'
        : 'log'

    if (env('NODE_ENV', 'development') === 'production') {
      console[method](JSON.stringify({ log: message, data }))
    } else {
      console[method](
        message,
        JSON.stringify(data, null, data.level === 'error' ? 2 : 0)
      )
    }
  }

  static subscribe(level: LoggerLevel, callback: LoggerSubscription) {
    const subscriptions = Logger.subscriptions.get(level) || []
    Logger.subscriptions.set(level, [...subscriptions, callback])
  }

  static unsubscribe(level: LoggerLevel, callback: LoggerSubscription) {
    const subscriptions = Logger.subscriptions.get(level) || []
    Logger.subscriptions.set(
      level,
      subscriptions.filter((subscription) => subscription !== callback)
    )
  }

  static broadcast(message: string, data: LoggerData) {
    queueMicrotask((): any => {
      const subscriptions = Logger.subscriptions.get(data.level)
      if (subscriptions && subscriptions.length > 0) {
        return Promise.all(
          subscriptions.map(async (subscription) => {
            try {
              return Promise.resolve(subscription(message, data))
            } catch (err) {
              Logger.write('error broadcasting logs: ' + err.message, {
                level: 'error',
                message,
                data,
              })
            }
          })
        )
      }
    })
  }

  #data: Record<string, any>
  #options: LoggerOptions

  constructor(data: Record<string, any> = {}, options: LoggerOptions = {}) {
    this.#data = data
    this.#options = options
  }

  extend(data: Record<string, any> = {}, options: LoggerOptions = {}) {
    return new Logger(
      { ...this.#data, ...data },
      { ...this.#options, ...options }
    )
  }

  subscribe(level: LoggerLevel, callback: LoggerSubscription) {
    Logger.subscribe(level, callback)
    return this
  }

  unsubscribe(level: LoggerLevel, callback: LoggerSubscription) {
    Logger.unsubscribe(level, callback)
    return this
  }

  private write(message: string, data: LoggerData) {
    if (!this.#options.disabled) {
      const extended = { ...data, ...this.#data }
      Logger.write(message, extended)
      Logger.broadcast(message, extended)
    }
  }

  log(message: string, data: Record<string, any> = {}): void {
    return this.write(message, { level: 'info', data })
  }

  warning(message: string, data: Record<string, any> = {}): void {
    return this.write(message, { level: 'warning', data })
  }

  error(message: string, data: Record<string, any> = {}): void {
    if (data instanceof Error) {
      data = {
        ...data,
        message: data.message,
        stack: data.stack,
      }
    }

    return this.write(message, { level: 'error', data })
  }
}

export default new Logger()
