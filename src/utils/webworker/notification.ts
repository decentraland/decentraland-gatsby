import { logger } from './debug'
import { PushNotificationAttributes } from './types'

export function registerNotification(
  defaultNotificationOptions: NotificationOptions
) {
  const worker: ServiceWorkerGlobalScope = self as any
  worker.addEventListener('push', (event) => {
    const data: PushNotificationAttributes = event.data?.json()
    logger.log(`New "push" event received with data:`, data)
    if (!(self.Notification && self.Notification.permission === 'granted')) {
      return
    }

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
