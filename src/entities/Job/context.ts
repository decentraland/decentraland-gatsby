import logger from '../Development/logger'
import { ScheduleFunction, UpdatePayloadFunction } from './types'

export default class JobContext<P extends {} = {}> {
  id: string | null
  handler: string | null
  payload: P = {} as P
  #schedule: ScheduleFunction
  #update: UpdatePayloadFunction

  constructor(
    id: string | null,
    handler: string | null,
    payload: P = {} as P,
    schedule: ScheduleFunction,
    update: UpdatePayloadFunction
  ) {
    this.id = id
    this.handler = handler
    this.payload = payload
    this.#schedule = schedule
    this.#update = update
  }

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

  async updatePayload(payload: Record<string, any> = {}) {
    if (this.id) {
      await this.#update(this.id, payload)
    }
  }

  async schedule(
    name: string | null,
    date: Date,
    payload: Record<string, any> = {}
  ) {
    if (name) {
      await this.#schedule(name, date, payload)
    }
  }
}
