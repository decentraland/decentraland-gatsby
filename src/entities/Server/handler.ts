import { yellow } from 'colors/safe'
import { ServiceStartHandler, ServiceStopHandler } from './types'

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

  process.on('SIGTERM', async () => {
    console.log(`SIGTERM received: ${yellow('shutting down services')}`)
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
  })
}
