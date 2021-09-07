import logger from '../Development/logger'
import { ScheduleFunction, UpdatePayloadFunction } from './types'

export default class JobContext<P extends object = {}> {
  constructor(
    public id: string | null,
    public handler: string | null,
    public payload: P = {} as P,
    private _schedule: ScheduleFunction,
    private _update: UpdatePayloadFunction
  ) {}

  log(message: string, data?: Record<string, any>) {
    logger.log(`[${this.handler || 'cron'}] ${message}`, {
      type: this.handler ? 'job' : 'cron',
      name: this.handler || 'cron',
      ...data,
    })
  }

  error(error: Error): void
  error(message: string): void
  error(message: string, data: Record<string, any>): void
  error(message: string | Error, data: Record<string, any> = {}) {
    let msg: string
    if (message instanceof Error) {
      msg = message.message
      data = {
        ...message,
        ...data,
        message: message.message,
        stack: message.stack,
      }
    } else {
      msg = message as string
    }

    logger.error(msg, data)
  }

  async updatePayload(payload: object = {}) {
    if (this.id) {
      await this._update(this.id, payload)
    }
  }

  async schedule(name: string | null, date: Date, payload: object = {}) {
    if (name) {
      await this._schedule(name, date, payload)
    }
  }
}
