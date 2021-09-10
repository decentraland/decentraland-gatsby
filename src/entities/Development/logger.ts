export class Logger {

  private write(log: string, data: Record<string, any> = {}) {
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({ log, ...data }))
    } else {
      console.log(log, JSON.stringify({ ...data }))
    }
  }

  log(log: string, data: Record<string, any> = {}): void {
    return this.write(log, { level: 'info', data })
  }

  warning(log: string, data: Record<string, any> = {}): void {
    return this.write(log, { level: 'warning', data })
  }

  error(log: string, data: Record<string, any> = {}): void {
    if (data instanceof Error) {
      data = {
        ...data,
        message: data.message,
        stack: data.stack,
      }
    }

    return this.write(log, { level: 'error', data })
  }
}

export default new Logger()
