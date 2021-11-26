import { sendNotification, RequestOptions, PushSubscription } from 'web-push'
import chunk from '../../utils/array/chunk'
import { PushNotificationAttributes } from '../../utils/webworker/types'
import logger from '../Development/logger'
import Sender from '../Mail/sender'
import { web_notification_sent_total } from './metrics'
import { PushNotificationSenderOptions, Subscription } from './types'

export default class PushNotificationSender {
  publicKey: string
  privateKey: string

  static Batch = 10

  constructor(options: PushNotificationSenderOptions) {
    this.publicKey = options.publicKey
    this.privateKey = options.privateKey
  }

  inc(value: number = 1) {
    web_notification_sent_total.inc({}, value)
  }

  async send(subscriptions: Subscription[], data: PushNotificationAttributes) {
    const result = {
      successful: [] as Subscription[],
      failed: [] as Subscription[],
    }
    for (const chunkSubscriptions of chunk(subscriptions, Sender.Batch)) {
      await Promise.all(
        chunkSubscriptions.map(async (subscription) => {
          const auth: PushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          }

          const options: RequestOptions = {
            vapidDetails: {
              subject: `mailto:${subscription.user}@dcl.gg`,
              publicKey: this.publicKey,
              privateKey: this.privateKey,
            },
          }

          try {
            await sendNotification(auth, JSON.stringify(data), options)
            result.successful.push(subscription)
            return true
          } catch (err) {
            logger.error(
              `Error sending push notification to user "${subscription.user}"`,
              err
            )
            result.failed.push(subscription)
            return false
          }
        })
      )

      this.inc(chunkSubscriptions.length)
    }

    return result
  }
}
