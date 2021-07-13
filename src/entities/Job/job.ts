import JobContext from './context'

export type Job<P extends object = {}> = ((ctx: JobContext<P>) => Promise<any>) & {
  jobName?: string
}

export function createJob<P extends object = {}>(jobName: string, job: (ctx: JobContext<P>) => Promise<any>): Job {
  return Object.assign(job, { jobName })
}