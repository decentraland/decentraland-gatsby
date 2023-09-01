import { randomUUID } from 'crypto'

import { CronJob } from 'cron'

import logger from '../Development/logger'
import { Pool, createVoidPool } from '../Pool/utils'
import JobContext from './context'
import { job_manager_duration_seconds, job_manager_pool_size } from './metrics'
import MemoryModel from './model/memory'
import DatabaseModel from './model/model'
import { CronTime, JobSettings, TimePresets } from './types'

import type { Job } from './job'

export default class JobManager {
  memory = false
  runningJobs = new Set<string>()
  jobs: Map<string, Job<any>> = new Map()
  crons: CronJob[] = []
  pool: Pool<any>
  interval: NodeJS.Timeout
  initialInterval: NodeJS.Timeout
  queue: Job[]
  running = false

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
    return this.use(job, { handler })
  }

  cron(cron: CronTime, job: Job<any>) {
    return this.use(job, { cron })
  }

  use(
    job: Job<any>,
    options: Partial<{ handler: string; cron: CronTime }> = {}
  ) {
    const handler = options.handler || job.jobName || job.name
    if (this.jobs.has(handler)) {
      logger.warning(`replacing job "${handler}"`, { handler, type: 'job' })
    }

    this.jobs.set(handler, job)

    if (options.cron) {
      this.crons.push(
        new CronJob(this.time(options.cron), () => {
          this.runJobs(randomUUID(), handler, {}, job)
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
    if (!this.running) {
      return
    }

    const jobs = await this.getModel().getPending()
    const pendingJobs = jobs.filter((job) => !this.runningJobs.has(job.id))

    if (pendingJobs.length) {
      Promise.all(
        pendingJobs.map((job) => this.run(job.id, job.name, job.payload))
      )
    }
  }

  updatePayload = async (id: string, payload: Record<string, any> = {}) => {
    await this.getModel().updatePayload(id, payload)
  }

  schedule = async (
    handler: string | Job<any>,
    date: Date,
    payload: Record<string, any> = {}
  ) => {
    const name =
      typeof handler === 'string' ? handler : handler.jobName || handler.name
    const job = await this.getModel().schedule(
      randomUUID(),
      name,
      date,
      payload
    )

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
    if (!this.running) {
      return
    }

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
        ...err,
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
