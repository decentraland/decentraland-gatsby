import env from "../../utils/env";
import { withBearerToken } from "../Auth/middleware";
import client from "../Prometheus/client";
import { handleRaw } from "../Route/handle";
import routes from "../Route/routes";

const PROMETHEUS_BEARE_TOKEN = env('PROMETHEUS_BEARE_TOKEN', '')

export default routes((router) => {

  if (PROMETHEUS_BEARE_TOKEN) {
    router.get('/metrics', withBearerToken([ PROMETHEUS_BEARE_TOKEN ]) ,handleRaw(getMetrics, 'text'))
  } else {
    router.get('/metrics', handleRaw(getMetrics, 'text'))
  }
})

export async function getMetrics() {
  return client.register.metrics()
}