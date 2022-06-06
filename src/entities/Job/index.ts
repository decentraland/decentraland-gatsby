import { Job, createJob } from './job'
import JobManager from './manager'
import { JobSettings } from './types'
import { jobInitializer } from './utils'

export default function job(options: JobSettings = {}) {
  return new JobManager(options)
}

export { JobSettings, Job, createJob, jobInitializer }
