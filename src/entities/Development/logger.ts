export type LoggerLevel = 'info' | 'warning' | 'error'
export type LoggerData = Record<string, any> & { level: LoggerLevel }
export type LoggerSubscription = (message: string, data: LoggerData) => any

export class Logger {
  static readonly subscriptions: Map<LoggerLevel, LoggerSubscription[]> =
    new Map()

  static write(message: string, data: LoggerData) {
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({ log: message, data }))
    } else {
      console.log(
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
              Logger.write('Error broadcasting logs', {
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

  constructor(private data: Record<string, any> = {}) {}

  extend(data: Record<string, any> = {}) {
    return new Logger({ ...this.data, ...data })
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
    const extended = { ...data, ...this.data }
    Logger.write(message, extended)
    Logger.broadcast(message, extended)
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
