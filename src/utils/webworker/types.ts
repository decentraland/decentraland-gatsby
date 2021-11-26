import type { RouteMatchCallback } from 'workbox-core/types'
import type { Route } from 'workbox-routing/Route'

export type PushNotificationAttributes = {
  title: string
  href?: string
  details?: string
  image?: string
  tag?: string
  icon?: string
  badge?: string
  expiration?: number
}

export type RouteHandler = RegExp | string | RouteMatchCallback | Route
