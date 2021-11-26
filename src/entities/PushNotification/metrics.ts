import client, { registerMetric } from '../Prometheus/metrics'

export const web_notification_sent_total = new client.Counter({
  name: 'web_notification_sent_total',
  help: 'Counter of notification sent through Web Push Notification',
  registers: [],
  labelNames: [],
})

registerMetric(web_notification_sent_total)
