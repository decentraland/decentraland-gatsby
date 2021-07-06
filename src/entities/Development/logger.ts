export class Logger {
  log(log: string, data: Record<string, any> = {}): void {
    if (process.env.NODE_ENV === 'production') {
      console.error(JSON.stringify({ level: 'info', log, ...data }))
    } else {
      console.log(log, data)
    }
  }

  warning(log: string, data: Record<string, any> = {}): void {
    if (process.env.NODE_ENV === 'production') {
      console.error(JSON.stringify({ level: 'warning', log, ...data }))
    } else {
      console.log(log, data)
    }
  }

  error(log: string, data: Record<string, any> = {}): void {
    if (process.env.NODE_ENV === 'production') {
      if (data instanceof Error) {
        data = {
          ...data,
          message: data.message,
          stack: data.stack,
        }
      }
      console.error(JSON.stringify({ level: 'error', log, ...data }))
    } else {
      console.log(log, data)
    }
  }
}

export default new Logger