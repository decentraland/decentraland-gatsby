import env from '../../utils/env'
import { ServiceStartHandler } from '../Server/types'
import JobManager from './manager'

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
