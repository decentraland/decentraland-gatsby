import { yellow } from 'colors/safe'
import client from 'prom-client'
import env from '../../utils/env'
import { withBearerToken } from '../Auth/middleware'
import { registry } from './metrics'
import { handleRaw } from '../Route/handle'
import routes from '../Route/routes'

const PROMETHEUS_BEARER_TOKEN = env('PROMETHEUS_BEARER_TOKEN', '')
const PROMETHEUS_REGISTRIES = [registry, client.register]
let PROMETHEUS_REGISTRY: client.Registry | null = null

export default routes((router) => {
  if (PROMETHEUS_BEARER_TOKEN) {
    console.log(
      `exposing private /metrics:`,
      yellow(`"Authentication: Bearer ${PROMETHEUS_BEARER_TOKEN}"`)
    )
    router.get(
      '/metrics',
      withBearerToken([PROMETHEUS_BEARER_TOKEN]),
      handleRaw(getMetrics, 'text')
    )
  } else {
    console.log(`exposing public /metrics`)
    router.get('/metrics', handleRaw(getMetrics, 'text'))
  }
})

export function exposeRegistry(registry: client.Registry) {
  if (!PROMETHEUS_REGISTRIES.includes(registry)) {
    PROMETHEUS_REGISTRIES.push(registry)
    PROMETHEUS_REGISTRY = null
  }

  return PROMETHEUS_REGISTRIES.length
}

export async function getMetrics() {
  if (!PROMETHEUS_REGISTRY) {
    PROMETHEUS_REGISTRY = client.Registry.merge(PROMETHEUS_REGISTRIES)
  }

  return PROMETHEUS_REGISTRY.metrics()
}
