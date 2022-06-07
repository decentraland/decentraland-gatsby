import JobContext from './context'

export type Job<P extends {} = {}> = ((ctx: JobContext<P>) => Promise<any>) & {
  jobName?: string
}

export function createJob<P extends {} = {}>(
  jobName: string,
  job: (ctx: JobContext<P>) => Promise<any>
): Job {
  return Object.assign(job, { jobName })
}
