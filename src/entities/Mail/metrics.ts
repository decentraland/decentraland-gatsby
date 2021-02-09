import client from 'prom-client'

export type SesSendLabels = Record<'region' | 'source' | 'bulk', string | number>

export const ses_send_total = new client.Counter({
  name: 'ses_send_total',
  help: 'Counter of email sent through SES',
  registers: [],
  labelNames: ['region', 'source', 'bulk']
})