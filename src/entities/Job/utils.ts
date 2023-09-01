import env from '../../utils/env'
import JobManager from './manager'

import type { ServiceStartHandler } from '../Server/types'

export const jobInitializer = (manager: JobManager): ServiceStartHandler => {
  return async () => {
    if (env('JOBS', 'true') === 'false') {
      return async () => {}
    }

    manager.start()
    return async () => {
      manager.stop()
    }
  }
}
