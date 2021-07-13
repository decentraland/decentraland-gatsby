import { CronJob } from 'cron'
import { v4 as uuid } from 'uuid'
import { JobSettings, TimePresets, CronTime } from './types'
import JobContext from './context'
import { createVoidPool, Pool } from '../Pool/utils'
import MemoryModel from './model/memory'
import DatabaseModel from './model/model'
import { job_manager_duration_seconds, job_manager_pool_size } from './metrics'
import logger from '../Development/logger'
import type { Job } from './job'

export default class JobManager {
  memory: boolean = false
  runningJobs = new Set<string>()
  jobs: Map<string, Job<any>> = new Map()
  crons: CronJob[] = []
  pool: Pool<any>
  interval: NodeJS.Timeout
  initialInterval: NodeJS.Timeout
  running: boolean = false

  constructor(settings: JobSettings) {
    const max = settings.concurrency || Infinity
    this.pool = createVoidPool({ min: 0, max })
    this.memory = !!settings.memory
    this.cron(this.time(settings.cron || '@minutely'), () => this.check())
  }

  time(cronTime: CronTime): string | Date {
    if (typeof cronTime === 'string' && TimePresets[cronTime]) {
      return TimePresets[cronTime]
    }

    return cronTime
  }

  getModel() {
    if (this.memory) {
      return MemoryModel
    }

    return DatabaseModel
  }

  stats() {
    return {
      size: this.pool.size,
      available: this.pool.available,
      running: this.pool.borrowed,
      pending: this.pool.pending,
      ids: Array.from(this.runningJobs.values()),
    }
  }

  define(handler: string, job: Job<any>) {
    return this.use({ handler }, job)
  }

  cron(cron: CronTime, job: Job<any>) {
    return this.use({ cron }, job)
  }

  use(options: Partial<{ handler: string, cron: CronTime }>, job: Job<any>) {
    const handler = options.handler || job.jobName || job.name
    if (this.jobs.has(handler)) {
      logger.warning(`replacing job "${handler}"`, { handler, type: 'job' })
    }

    this.jobs.set(handler, job)

    if (options.cron) {
      this.crons.push(
        new CronJob(this.time(options.cron), () => {
          this.runJobs(uuid(), handler, {}, job)
        })
      )
    }

    return this
  }

  start() {
    this.crons.forEach((cron) => cron.start())
    this.running = true
  }

  stop() {
    this.crons.forEach((cron) => cron.stop())
    this.running = false
  }

  async check() {
    const jobs = await this.getModel().getPending()
    const pendingJobs = jobs.filter((job) => !this.runningJobs.has(job.id))

    if (pendingJobs.length) {
      Promise.all(
        pendingJobs.map((job) => this.run(job.id, job.name, job.payload))
      )
    }
  }

  updatePayload = async (id: string, payload: object = {}) => {
    await this.getModel().updatePayload(id, payload)
  }

  schedule = async (handler: string, date: Date, payload: object = {}) => {
    const job = await this.getModel().schedule(uuid(), handler, date, payload)

    if (this.running && job.run_at.getTime() < Date.now()) {
      this.run(job.id, job.name, job.payload)
    }
  }

  async run(id: string, handler: string, payload: any): Promise<void> {
    const context = { type: 'job', id, name: handler, payload }
    if (!this.jobs.has(handler)) {
      logger.error(`Missing job: ${handler} (id: "${id}")`, context)
      return
    }

    if (this.runningJobs.has(id)) {
      logger.log(`Job ${handler} (id: "${id}") is already running`, context)
      return
    }

    await this.runJobs(id, handler, payload, this.jobs.get(handler)!)
  }

  async runJobs(
    id: string,
    handler: string,
    payload: any,
    job: Job<any>
  ): Promise<void> {

    const context = new JobContext(
      id,
      handler || job.name,
      payload || {},
      this.schedule,
      this.updatePayload
    )

    if (id) {
      this.runningJobs.add(id)
    }

    let error = 0
    const labels = { job: handler || 'uknown' }
    job_manager_pool_size.inc(labels)
    const completeJob = job_manager_duration_seconds.startTimer(labels)
    const resource = await this.pool.acquire()

    try {
      await job(context)
      if (id) {
        await this.getModel().complete(id)
      }
    } catch (err) {
      logger.error(`Error running job "${handler}"`, {
        type: 'cron',
        id,
        handler,
        payload,
        message: err.message,
        stack: err.stack,
        ...err
      })

      error = 1
    }

    await this.pool.release(resource)
    completeJob({ error })
    job_manager_pool_size.dec(labels)

    if (id) {
      this.runningJobs.delete(id)
    }
  }
}
