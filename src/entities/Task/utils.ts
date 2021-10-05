import { clusterInitializer } from '../Cluster/utils'
import { emptyServiceInitializer, ServiceStartHandler } from '../Server/types'
import TaskManager from './TaskManager'

export const taskInitializer = (manager: TaskManager): ServiceStartHandler => {
  if (process.env.TASKS === 'false') {
    return emptyServiceInitializer()
  }

  return clusterInitializer(
    process.env.CLUSTER === 'true' || process.env.TASKS_CLUSTER === 'true',
    {
      CLUSTER: 'false',
      HTTP_CLUSTER: 'false',
      HTTP: 'false',
      JOBS_CLUSTER: 'false',
      JOBS: 'false',
      TASKS_CLUSTER: 'false',
      TASKS: 'true',
    },
    async () => {
      await manager.start()
      return async () => {
        await manager.stop()
      }
    }
  )
}
