import JobManager from './manager'
import { JobSettings } from './types'

export default function job(options: JobSettings = {}) {
  return new JobManager(options)
}
