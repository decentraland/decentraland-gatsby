import chalk from 'chalk'

import type { ServiceStartHandler, ServiceStopHandler } from './types'

export async function initializeServices(
  serviceInitializers: (ServiceStartHandler | false | null | undefined)[]
) {
  const services: ServiceStopHandler[] = []
  for (const initializer of serviceInitializers) {
    if (initializer) {
      const service = await initializer()
      services.push(service)
    }
  }

  const shutdown = async () => {
    while (services.length) {
      const stop = services.pop()!
      try {
        await stop()
      } catch (err) {
        services.push(stop)
        throw err
      }
    }

    process.exit(0)
  }

  process.on('SIGINT', async () => {
    console.log(`SIGINT received: ${chalk.yellow('shutting down services')}`)
    await shutdown()
  })

  process.on('SIGTERM', async () => {
    console.log(`SIGTERM received: ${chalk.yellow('shutting down services')}`)
    await shutdown()
  })
}
