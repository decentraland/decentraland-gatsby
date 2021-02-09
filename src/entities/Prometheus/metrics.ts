import client from 'prom-client'
const defaultLabels: Record<string, string> = {}

if (process.env.SERVICE_NAME) {
  defaultLabels.serviceName = process.env.SERVICE_NAME
}

if (process.env.SERVICE_VERSION) {
  defaultLabels.serviceVersion = process.env.SERVICE_VERSION
}

if (process.env.SERVICE_URL) {
  defaultLabels.serviceUrl = process.env.SERVICE_URL
}

export const registry = new client.Registry();
registry.setDefaultLabels(defaultLabels)

const alreadyRegisted = new Set<client.Metric<string>>()
export function regiterMetrics(metric: client.Metric<string>) {
  if (!alreadyRegisted.has(metric)) {
    registry.registerMetric(metric)
    alreadyRegisted.add(metric)
  }
}

export type HttpRequestLabels = Record<'method' | 'path' | 'statusCode', string | number>

export const http_request_duration_seconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Request response time in sendonds',
  registers: [],
  labelNames: [ 'method', 'path', 'statusCode' ],
  buckets: [ 1, 2, 3, 5, 8, 13, 21, 34, 55 ],
})
