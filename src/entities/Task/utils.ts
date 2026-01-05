import env from '../../utils/env'
import { clusterInitializer } from '../Cluster/utils'
import { ServiceStartHandler, emptyServiceInitializer } from '../Server/types'
import TaskManager from './TaskManager'

export const taskInitializer = (manager: TaskManager): ServiceStartHandler => {
  if (env('TASKS', 'true') === 'false') {
    return emptyServiceInitializer()
  }

  return clusterInitializer(
    env('CLUSTER', 'false') === 'true' ||
      env('TASKS_CLUSTER', 'false') === 'true',
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
