import client, { registerMetric } from '../Prometheus/metrics'

export type SesSendLabels = Record<
  'region' | 'source' | 'bulk',
  string | number
>

export const aws_ses_sent_total = new client.Counter({
  name: 'aws_ses_sent_total',
  help: 'Counter of email sent through SES',
  registers: [],
  labelNames: ['region', 'email', 'bulk'],
})

registerMetric(aws_ses_sent_total)
