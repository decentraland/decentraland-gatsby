import { RangeRequestsPlugin } from 'workbox-range-requests'
import { registerRoute } from 'workbox-routing'
import * as strategies from 'workbox-strategies'

import { ServiceWorkerLoggerPlugin } from './debug'
import { RouteHandler } from './types'

export function registerImmutableFiles(route: RouteHandler) {
  registerRoute(
    route,
    new strategies.CacheFirst({
      plugins: [new ServiceWorkerLoggerPlugin('RegisterImmutableFiles')],
    })
  )
}

export function registerCacheFirstFiles(
  route: RouteHandler,
  name = 'RegisterCacheFirstFiles'
) {
  registerRoute(
    route,
    new strategies.CacheFirst({
      plugins: [new ServiceWorkerLoggerPlugin(name)],
    })
  )
}

export function registerNetworkFirstFiles(
  route: RouteHandler,
  name = 'RegisterNetworkFirstFiles'
) {
  registerRoute(
    route,
    new strategies.NetworkFirst({
      plugins: [new ServiceWorkerLoggerPlugin(name)],
    })
  )
}

export function registerGatsbyImmutableFiles() {
  registerRoute(
    ({ url }) => {
      return (
        (self.location.hostname === url.hostname &&
          url.pathname.startsWith('/static/')) ||
        /[a-f0-9]{20,20}\.(js|css|js\.map|js\.LICENSE\.txt)$/.test(url.pathname)
      )
    },
    new strategies.CacheFirst({
      plugins: [new ServiceWorkerLoggerPlugin('RegisterGatsbyImmutableFiles')],
    })
  )
}

export function registerCatalystImmutableFiles() {
  registerRoute(
    ({ url }) => {
      return (
        url.host.startsWith('peer') &&
        url.host.endsWith('.decentraland.org') &&
        url.pathname.startsWith('/content/contents/')
      )
    },
    new strategies.CacheFirst({
      plugins: [
        new RangeRequestsPlugin(),
        new ServiceWorkerLoggerPlugin('RegisterCatalystImmutableFiles'),
      ],
    })
  )
}
