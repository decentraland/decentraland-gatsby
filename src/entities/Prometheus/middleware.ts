import { middleware } from '../Route/handle'
import env from '../../utils/env'
import { withBearerToken } from '../Auth/middleware'

const PROMETHEUS_BEARER_TOKEN = env('PROMETHEUS_BEARER_TOKEN', '')

export function withPrometheusToken(options: Partial<{ optional: boolean }>) {
  if (PROMETHEUS_BEARER_TOKEN) {
    return withBearerToken([PROMETHEUS_BEARER_TOKEN])
  } else if (options.optional) {
    return middleware(async () => {})
  } else {
    throw new Error(`Missing environment variable PROMETHEUS_BEARER_TOKEN`)
  }
}
