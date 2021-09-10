import { Server } from 'http'
import cluster from 'cluster'
import { Application } from 'express'
import { cpus, networkInterfaces } from 'os'
import { yellow, green } from 'colors/safe'
import { ServiceStartHandler } from './types'

export const DEFAULT_PORT = 4000
export const DEFAULT_HOST = '0.0.0.0'

function log(protocol: string, host: string, port: string | number) {
  const workerDetails = cluster.isMaster
    ? { cluster: 'master', pid: process.pid }
    : { cluster: cluster.worker.id, pid: process.pid }

  if (host === '127.0.0.1') {
    console.log(
      `running server on:`,
      yellow(`${protocol}localhost:${port}`),
      green(JSON.stringify(workerDetails))
    )
  }

  console.log(
    `running server on:`,
    yellow(`${protocol}${host}:${port}`),
    green(JSON.stringify(workerDetails))
  )
}

export async function listen(
  app: Application,
  port: number | string = process.env.PORT || DEFAULT_PORT,
  host: string = process.env.HOST || DEFAULT_HOST
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
  return async () => {
    if (process.env.HTTP === 'false') {
      return async () => {}
    }

    if (process.env.HTTP_CLUSTER !== 'true') {
      const server = await listen(app, port, host)

      return () =>
        new Promise<void>((resolve, reject) => {
          console.log(`stopping server...`)
          server.close((err?: Error) => {
            err ? reject(err) : resolve()
          })
        })
    } else {
      const workers = cpus().map(() => {
        console.log(`forking http server...`)
        return cluster.fork({
          ...process.env,
          HTTP_CLUSTER: 'false',
          JOBS: 'false'
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
    }
  }
}
