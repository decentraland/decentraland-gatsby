import { Registry, register } from 'prom-client'

import withPrometheusToken from './withPrometheusToken'
import Context from '../../Route/wkc/context/Context'
import ContentTypeResponse from '../../Route/wkc/response/ContentTypeResponse'
import routes from '../../Route/wkc/routes'

export default function metrics(registries: Registry[]) {
  const globalRegistry = Registry.merge(registries)
  const auth = withPrometheusToken()
  return routes((router) => {
    router.get('/metrics', async (ctx: Pick<Context, 'request'>) => {
      await auth(ctx)
      const body = await globalRegistry.metrics()
      return new ContentTypeResponse(body, register.contentType)
    })
  })
}
