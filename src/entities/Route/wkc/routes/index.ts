import Router, { RouterOptions } from './Router'

export default function routes(
  handle: (router: Router) => void,
  options: RouterOptions = {}
) {
  const router = new Router(options)
  handle(router)
  return router.getRouter()
}
