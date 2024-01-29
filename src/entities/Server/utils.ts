import cluster from 'cluster'
import { Server } from 'http'
import { networkInterfaces } from 'os'

import chalk from 'chalk'
import { Application } from 'express'

import env from '../../utils/env'
import { clusterInitializer } from '../Cluster/utils'
import { ServiceStartHandler, emptyServiceInitializer } from './types'

export const DEFAULT_PORT = '4000'
export const DEFAULT_HOST = '0.0.0.0'

function log(protocol: string, host: string, port: string | number) {
  const workerDetails = !cluster.worker
    ? { cluster: 'primary', pid: process.pid }
    : { cluster: cluster.worker.id, pid: process.pid }

  if (host === '127.0.0.1') {
    console.log(
      `running server on:`,
      chalk.yellow(`${protocol}localhost:${port}`),
      chalk.green(JSON.stringify(workerDetails))
    )
  }

  console.log(
    `running server on:`,
    chalk.yellow(`${protocol}${host}:${port}`),
    chalk.green(JSON.stringify(workerDetails))
  )
}

export async function listen(
  app: Application,
  port: number | string = env('PORT', DEFAULT_PORT),
  host: string = env('HOST', DEFAULT_HOST)
) {
  port = Number(port)

  if (!Number.isFinite(port)) {
    port = 4000
  }

  return new Promise<Server>((resolve) => {
    const server: Server = app.listen(port as number, host, () => {
      const protocol = 'http://'
      const canonicalHost = host === DEFAULT_HOST ? '127.0.0.1' : host

      if (host !== DEFAULT_HOST) {
        log(protocol, canonicalHost, port)
      } else {
        const interfaces = networkInterfaces()
        for (const details of Object.values(interfaces)) {
          if (details) {
            for (const detail of details) {
              if (detail.family === 'IPv4') {
                log(protocol, detail.address, port)
              }
            }
          }
        }
      }

      return resolve(server)
    })
  })
}

export const serverInitializer = (
  app: Application,
  port: number | string = DEFAULT_PORT,
  host: string = DEFAULT_HOST
): ServiceStartHandler => {
  if (env('HTTP', 'true') === 'false') {
    return emptyServiceInitializer()
  }

  return clusterInitializer(
    env('CLUSTER', 'false') === 'true' ||
      env('TASKS_CLUSTER', 'false') === 'true',
    {
      CLUSTER: 'false',
      HTTP_CLUSTER: 'false',
      HTTP: 'true',
      JOBS_CLUSTER: 'false',
      JOBS: 'false',
      TASKS_CLUSTER: 'false',
      TASKS: 'false',
    },
    async () => {
      const server = await listen(app, port, host)

      return () =>
        new Promise<void>((resolve, reject) => {
          console.log(`stopping server...`)
          server.close((err?: Error) => {
            err ? reject(err) : resolve()
          })
        })
    }
  )
}
