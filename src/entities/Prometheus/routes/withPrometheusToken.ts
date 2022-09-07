import env from '../../../utils/env'
import withBearerToken from '../../Auth/routes/withBearerToken'
import Context from '../../Route/wkc/context/Context'

export function withPrometheusToken() {
  const PROMETHEUS_BEARER_TOKEN = env('PROMETHEUS_BEARER_TOKEN', '')

  if (PROMETHEUS_BEARER_TOKEN) {
    return withBearerToken({ tokens: [PROMETHEUS_BEARER_TOKEN] })
  } else {
    console.log(`Missing environment variable PROMETHEUS_BEARER_TOKEN`)
    return async (_ctx: Pick<Context, 'request'>) => null
  }
}

export default withPrometheusToken
