import { registerRoute } from 'workbox-routing'
import * as strategies from 'workbox-strategies'
import { PushNotificationAttributes } from './types'

export function registerNotification(
  defaultNotificationOptions: NotificationOptions
) {
  const worker: ServiceWorkerGlobalScope = self as any
  worker.addEventListener('push', (event) => {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
      return
    }

    const data: PushNotificationAttributes = event.data?.json()
    if (!data || !data.title) {
      return
    }

    if (data.expiration && data.expiration > Date.now()) {
      return
    }

    const options: NotificationOptions = {
      ...defaultNotificationOptions,
      data,
    }

    if (data.details) {
      options.body = data.details
    }

    const props = ['image', 'tag', 'icon', 'badge']

    for (const prop of props) {
      if (data[prop]) {
        options[prop] = data[prop]
      }
    }

    event.waitUntil(worker.registration.showNotification(data.title, options))
  })

  worker.addEventListener('notificationclick', function (event) {
    event.notification.close()
    const data: PushNotificationAttributes = event.notification.data || {}
    if (data.href) {
      event.waitUntil(worker.clients.openWindow(data.href))
    }
  })
}
