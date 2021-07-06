import logger from '../Development/logger'
import { ServiceStartHandler } from '../Server/types'
import JobContext from './context'
import JobManager from './job'
import { NextFunction } from './types'

export function reschedule(time: number) {
  return async (ctx: JobContext<any>, next: NextFunction) => {
    await next()
    if (ctx.name) {
      await ctx.schedule(ctx.name, new Date(Date.now() + time), ctx.payload)
    }
  }
}

export function log() {
  return async (ctx: JobContext<any>, next: NextFunction) => {
    const startAt = Date.now()
    await next()
    const time = Date.now() - startAt
    const seconds = (time / 1000).toFixed(3)
    if (ctx.name) {
      logger.log(`Job "${ctx.name}" (id: "${ctx.id}") completed! time: ${seconds}s`, {
        id: ctx.id,
        name: ctx.name,
        time
      })
    } else {
      logger.log(`Cron completed! time: ${seconds}s`, { name: 'cron', time })
    }
  }
}

export const jobInitializer = (manager: JobManager): ServiceStartHandler => {
  return async () => {
    manager.start()
    return async () => {
      manager.stop()
    }
  }
}