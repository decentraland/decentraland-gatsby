import client from 'prom-client'
import { registry } from './metrics'
import { handleRaw } from '../Route/handle'
import routes from '../Route/routes'
import { withPrometheusToken } from './middleware'

const PROMETHEUS_REGISTRIES = [registry, client.register]
let PROMETHEUS_REGISTRY: client.Registry | null = null

export default routes((router) => {
  router.get('/metrics', withPrometheusToken({ optional: true }), handleRaw(getMetrics, 'text'))
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
