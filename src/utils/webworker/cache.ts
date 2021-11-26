import { registerRoute } from 'workbox-routing'
import * as strategies from 'workbox-strategies'
import { RouteHandler } from './types'

export function registerImmutableFiles(route: RouteHandler) {
  registerRoute(route, new strategies.CacheFirst())
}

export function registerCacheFirstFiles(route: RouteHandler) {
  registerRoute(route, new strategies.CacheFirst())
}

export function registerNetworkFirstFiles(route: RouteHandler) {
  registerRoute(route, new strategies.NetworkFirst())
}

export function registerGatsbyImmutableFiles() {
  registerRoute(({ url }) => {
    return (
      (self.location.hostname === url.hostname &&
        url.pathname.startsWith('/static/')) ||
      /[a-f0-9]{20,20}\.(js|css|js\.map|js\.LICENSE\.txt)$/.test(url.pathname)
    )
  }, new strategies.CacheFirst())
}

export function registerCatalystImmutableFiles() {
  registerRoute(({ url }) => {
    return (
      url.host.startsWith('peer') &&
      url.host.endsWith('.decentraland.org') &&
      url.pathname.startsWith('/content/contents/')
    )
  }, new strategies.CacheFirst())
}
