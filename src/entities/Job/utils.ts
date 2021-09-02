import { ServiceStartHandler } from '../Server/types'
import JobManager from './manager'

export const jobInitializer = (manager: JobManager): ServiceStartHandler => {
  return async () => {
    if (process.env.JOBS === 'false') {
      return async () => {}
    }

    manager.start()
    return async () => {
      manager.stop()
    }
  }
}