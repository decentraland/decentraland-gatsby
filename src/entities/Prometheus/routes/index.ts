import { Registry, register } from 'prom-client'

import Context from '../../Route/wkc/context/Context'
import ContentTypeResponse from '../../Route/wkc/response/ContentTypeResponse'
import routes from '../../Route/wkc/routes'
import { registry } from '../metrics'
import { withPrometheusToken } from './withPrometheusToken'

const PROMETHEUS_REGISTRIES = [registry, register]
let PROMETHEUS_REGISTRY = Registry.merge(PROMETHEUS_REGISTRIES)

export default routes((router) => {
  router.get('/metrics', getMetrics)
})

const auth = withPrometheusToken()
export async function getMetrics(ctx: Pick<Context, 'request'>) {
  await auth(ctx)
  const body = await PROMETHEUS_REGISTRY.metrics()
  return new ContentTypeResponse(body, register.contentType)
}

export function exposeRegistry(registry: Registry) {
  if (!PROMETHEUS_REGISTRIES.includes(registry)) {
    PROMETHEUS_REGISTRIES.push(registry)
    PROMETHEUS_REGISTRY = Registry.merge(PROMETHEUS_REGISTRIES)
  }

  return PROMETHEUS_REGISTRIES.length
}
