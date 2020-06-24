import { CronJob } from 'cron'
import { JobSettings, NextFunction } from './types'
import JobContext from './context'
import Model from './model'
import { createVoidPool, Pool } from '../Pool/utils'
import MemoryModel from './memory'

export type Job = <P extends object = {}>(ctx: JobContext<P>, next: NextFunction) => Promise<void>

export default class JobManager {

  memory: boolean = false;
  running = new Set<string>()
  jobs: Map<string, Job[]> = new Map()
  crons: CronJob[] = []
  pool: Pool<any>;
  interval: NodeJS.Timeout
  initialInterval: NodeJS.Timeout

  constructor(settings: JobSettings) {
    const max = settings.concurrency || Infinity
    this.pool = createVoidPool({ min: 0, max })
    this.memory = !!settings.memory
    this.cron('0 * * * * *', () => this.check())
  }

  getModel() {
    if (this.memory) {
      return MemoryModel
    }

    return Model
  }

  stats() {
    return {
      size: this.pool.size,
      available: this.pool.available,
      running: this.pool.borrowed,
      pending: this.pool.pending,
      ids: Array.from(this.running.values())
    }
  }

  define(jobName: string, job: Job, ...extraJobs: Job[]) {
    const jobs = this.jobs.get(jobName) || []
    this.jobs.set(jobName, [...jobs, job, ...extraJobs])
    return this
  }

  cron(cronTime: string | Date, job: Job, ...extraJobs: Job[]) {
    this.crons.push(new CronJob(cronTime, () => {
      this.runJobs(null, null, {}, [job, ...extraJobs])
    }))
  }

  start() {
    this.crons.forEach(cron => cron.start())
  }

  stop() {
    this.crons.forEach(cron => cron.stop())
  }

  async check() {
    const jobs = await this.getModel().getPending()
    await Promise.all(jobs.map(job => this.run(job.id, job.name, job.payload)))
  }

  async schedule(jobName: string, date: Date, payload: object = {}) {
    const job = await this.getModel().schedule(jobName, date, payload)
    if (job.run_at.getTime() < Date.now()) {
      this.run(job.id, job.name, job.payload)
    }

    return job
  }

  async run(id: string | null, name: string, payload: any): Promise<void> {

    if (!this.jobs.has(name)) {
      console.log(`Missing job: ${name} (id: "${id}")`)
      return
    }

    if (id && this.running.has(id)) {
      console.log(`Job ${name} (id: "${id}") is already running`)
      return
    }

    await this.runJobs(id, name, payload, this.jobs.get(name) as Job[])
  }

  async runJobs(id: string | null, name: string | null, payload: any, jobs: Job[]): Promise<void> {
    let current = 0;

    const schedule = (jobName: string, date: Date, payload: object = {}) => {
      return this.schedule(jobName, date, payload)
    }

    const context = new JobContext(
      id,
      name,
      payload || {},
      schedule
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
      this.running.add(id)
    }
    const resource = await this.pool.acquire()

    try {
      await next()
      if (id) {
        await this.getModel().complete(id)
      }
    } catch (err) {
      console.error(`Error running job: "${name}" (id: "${id}")`, err)
    }

    await this.pool.release(resource)
    if (id) {
      this.running.delete(id)
    }
  }
}