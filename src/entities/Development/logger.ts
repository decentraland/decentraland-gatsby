import cluster from 'cluster'
import once from '../../utils/function/once'

export class Logger {

  static getServiceData = once(() => {
    const serviceData: Record<string, any> = {}
    serviceData.cluster = cluster.isMaster ? 'master' : cluster.worker.id
    return serviceData
  })

  private write(log: string, data: Record<string, any> = {}) {
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({ log, ...data, ...Logger.getServiceData() }))
    } else {
      console.log(log, JSON.stringify({ ...data, ...Logger.getServiceData() }))
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
