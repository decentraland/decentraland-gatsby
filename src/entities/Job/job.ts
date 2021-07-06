import { CronJob } from 'cron'
import { JobSettings, NextFunction, TimePresets, CronTime } from './types'
import JobContext from './context'
import { createVoidPool, Pool } from '../Pool/utils'
import MemoryModel from './model/memory'
import DatabaseModel from './model/model'
import { job_manager_duration_seconds, job_manager_pool_size } from './metrics'
import logger from '../Development/logger'

export interface Job<P extends object = {}> {
  (ctx: JobContext<P>, next: NextFunction): Promise<void>
}

export default class JobManager {
  memory: boolean = false
  runningJobs = new Set<string>()
  jobs: Map<string, Job<any>[]> = new Map()
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

  define(jobName: string, job: Job<any>, ...extraJobs: Job<any>[]) {
    const jobs = this.jobs.get(jobName) || []
    this.jobs.set(jobName, [...jobs, job, ...extraJobs])
    return this
  }

  cron(cronTime: CronTime, job: Job<any>, ...extraJobs: Job<any>[]) {
    this.crons.push(
      new CronJob(this.time(cronTime), () => {
        this.runJobs(null, 'cron', {}, [job, ...extraJobs])
      })
    )
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

  schedule = async (jobName: string, date: Date, payload: object = {}) => {
    const job = await this.getModel().schedule(jobName, date, payload)
    if (this.running && job.run_at.getTime() < Date.now()) {
      this.run(job.id, job.name, job.payload)
    }
  }

  async run(id: string | null, name: string, payload: any): Promise<void> {
    const context = { type: 'job', id, name, payload }
    if (!this.jobs.has(name)) {
      logger.error(`Missing job: ${name} (id: "${id}")`, context)
      return
    }

    if (id && this.runningJobs.has(id)) {
      logger.log(`Job ${name} (id: "${id}") is already running`, context)
      return
    }

    await this.runJobs(id, name, payload, this.jobs.get(name) as Job<any>[])
  }

  async runJobs(
    id: string | null,
    name: string | null,
    payload: any,
    jobs: Job<any>[]
  ): Promise<void> {
    let current = 0

    const context = new JobContext(
      id,
      name,
      payload || {},
      this.schedule,
      this.updatePayload
    )

    const next = async (): Promise<void> => {
      const i = current
      if (jobs[i]) {
        current++
        let job = jobs[i]
        await job(context, next)
      }
    }

    if (id) {
      this.runningJobs.add(id)
    }

    let error = 0
    const labels = { job: name || 'uknown' }
    job_manager_pool_size.inc(labels)
    const completeJob = job_manager_duration_seconds.startTimer(labels)
    const resource = await this.pool.acquire()

    try {
      await next()
      if (id) {
        await this.getModel().complete(id)
      }
    } catch (err) {
      logger.error(`Error running job "${name}"`, {
        type: 'cron',
        id,
        name,
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
