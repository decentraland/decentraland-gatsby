import { yellow } from 'colors/safe'
import client from 'prom-client'
import env from "../../utils/env";
import { withBearerToken } from "../Auth/middleware";
import { registry } from "./metrics";
import { handleRaw } from "../Route/handle";
import routes from "../Route/routes";

const PROMETHEUS_BEARER_TOKEN = env('PROMETHEUS_BEARER_TOKEN', '')
const PROMETHEUS_REGISTRIES = new Set([ registry, client.register ])
let PROMETHEUS_EXPOSED = client.Registry.merge(Array.from(PROMETHEUS_REGISTRIES))

export default routes((router) => {
  if (PROMETHEUS_BEARER_TOKEN) {
    console.log(`exposing private /metrics:`, yellow(`"Authentication: Bearer ${PROMETHEUS_BEARER_TOKEN}"`))
    router.get('/metrics', withBearerToken([ PROMETHEUS_BEARER_TOKEN ]), handleRaw(getMetrics, 'text'))
  } else {
    console.log(`exposing public /metrics`)
    router.get('/metrics', handleRaw(getMetrics, 'text'))
  }
})

export function exposeRegistry(registry: client.Registry) {
  PROMETHEUS_REGISTRIES.add(registry)
  PROMETHEUS_EXPOSED = client.Registry.merge(Array.from(PROMETHEUS_REGISTRIES))
}

export async function getMetrics() {
  return PROMETHEUS_EXPOSED.metrics()
}