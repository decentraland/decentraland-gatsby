import { ServiceStartHandler } from '../Server/types'
import JobManager from './manager'

export const jobInitializer = (manager: JobManager): ServiceStartHandler => {
  return async () => {
    manager.start()
    return async () => {
      manager.stop()
    }
  }
}