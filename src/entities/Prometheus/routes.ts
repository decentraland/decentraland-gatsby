import client from 'prom-client'
import { registry } from './metrics'
import { handleRaw } from '../Route/handle'
import routes from '../Route/routes'
import { withPrometheusToken } from './middleware'
import { ClusterRegistry } from './cluster'

const PROMETHEUS_REGISTRIES = [registry, client.register]
let PROMETHEUS_REGISTRY = ClusterRegistry.merge(PROMETHEUS_REGISTRIES)

export default routes((router) => {
  router.get(
    '/metrics',
    withPrometheusToken({ optional: true }),
    handleRaw(getMetrics, client.register.contentType)
  )
})

export function exposeRegistry(registry: client.Registry) {
  if (!PROMETHEUS_REGISTRIES.includes(registry)) {
    PROMETHEUS_REGISTRIES.push(registry)
    if (PROMETHEUS_REGISTRY instanceof ClusterRegistry) {
      ClusterRegistry.removeEventListener(PROMETHEUS_REGISTRY)
    }

    PROMETHEUS_REGISTRY = ClusterRegistry.merge(PROMETHEUS_REGISTRIES)
  }

  return PROMETHEUS_REGISTRIES.length
}

export async function getMetrics() {
  return PROMETHEUS_REGISTRY.metrics()
}
