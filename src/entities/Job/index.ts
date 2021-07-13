import JobManager from './manager'
import { Job, createJob } from './job'
import { jobInitializer } from './utils'
import { JobSettings } from './types'

export default function job(options: JobSettings = {}) {
  return new JobManager(options)
}

export { JobSettings, Job, createJob, jobInitializer }
