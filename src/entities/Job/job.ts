import { createPool, Pool } from 'generic-pool'
import { JobSettings, NextFunction } from './types'
import JobContext from './context'
import Model from './model'

export type Job = <P extends object = {}>(ctx: JobContext<P>, next: NextFunction) => Promise<void>

const poolFactory = {
  async create() { return () => null },
  async destroy() { }
}

export default class JobManager {

  running = new Set<string>()
  jobs: Map<string, Job[]> = new Map()
  pool: Pool<any>;
  interval: NodeJS.Timeout

  constructor(settings: JobSettings) {
    const max = settings.concurrency || Infinity
    this.pool = createPool(poolFactory, { min: 0, max })
  }

  use(jobName: string, job: Job, ...extraJobs: Job[]) {
    const jobs = this.jobs.get(jobName) || []
    this.jobs.set(jobName, [...jobs, job, ...extraJobs])
    return this
  }

  start(checkInterval: number = 1000 * 60) {
    this.interval = setTimeout(() => {
      this.interval = setInterval(() => this.check(), checkInterval)
      this.check()
    }, Date.now() % checkInterval)
  }

  async check() {
    const jobs = await Model.getPending()
    return Promise.all(jobs.map(job => this.runJob(job.id, job.name, job.payload)))
  }

  async schedule(jobName: string, date: Date, payload: object = {}) {
    const job = await Model.schedule(jobName, date, payload)
    if (job.run_at.getTime() < Date.now()) {
      this.runJob(job.id, job.name, job.payload)
    }

    return job
  }

  async runJob(id: string, name: string, payload: any): Promise<void> {
    if (!this.jobs.has(name)) {
      console.log(`Missing job: ${name} (id: "${id}")`)
      return
    }

    if (this.running.has(id)) {
      console.log(`Job ${name} (id: "${id}") is already running`)
      return
    }

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

    const jobs = this.jobs.get(name) as Job[];

    const next = async (): Promise<void> => {
      const i = current
      if (jobs[i]) {
        current++
        let job = jobs[i]
        await job(context, next)
      }
    }

    this.running.add(id)
    const resource = this.pool.acquire()

    try {
      await next()
      await Model.complete(id)
    } catch (err) {
      console.error(`Error running job: "${name}" (id: "${id}")`, err)
    }

    await this.pool.release(resource)
    this.running.delete(id)
  }
}