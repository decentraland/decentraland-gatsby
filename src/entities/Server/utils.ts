import { Application } from 'express'
import { networkInterfaces } from 'os'

export const DEFAULT_PORT = 4000
export const DEFAULT_HOST = '0.0.0.0'

function log(protocol: string, host: string, port: string | number) {
  if (host === '127.0.0.1') {
    console.log(`running server on: ${protocol}localhost:${port}`)
  }
  console.log(`running server on: ${protocol}${host}:${port}`)
}

export async function listen(app: Application, port: number | string = DEFAULT_PORT, host: string = DEFAULT_HOST) {
  port = Number(port)

  if (!Number.isFinite(port)) {
    port = 4000
  }

  return new Promise((resolve, reject) => {
    const server = app.listen(port as number, host, (error: Error) => {
      if (error) {
        return reject(error)
      }

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