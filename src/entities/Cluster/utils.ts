import cluster from 'cluster'
import { cpus } from 'os'

import { ServiceStartHandler } from '../Server/types'

export function clusterInitializer(
  shouldFork: boolean,
  environmentFork: Record<string, string>,
  initializer: ServiceStartHandler
) {
  return async () => {
    if (shouldFork) {
      const workers = cpus().map(() => {
        console.log(`forking cluster server...`)
        return cluster.fork({
          ...process.env,
          ...environmentFork,
        })
      })

      return async () =>
        Promise.all(
          workers.map(async (worker) => {
            const waitForClose = new Promise((resolve) => {
              worker.on('exit', () => resolve(null))
            })

            worker.kill()

            return waitForClose
          })
        )
    } else {
      const service = await initializer()

      return async () => {
        console.log(`stoping cluster server...`)
        return service()
      }
    }
  }
}
