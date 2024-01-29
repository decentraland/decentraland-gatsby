import client, { Registry, collectDefaultMetrics } from 'prom-client'

declare const Bun: {}

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

export default client
export const gatsbyRegister = new Registry()
gatsbyRegister.setDefaultLabels(defaultLabels)

if (typeof Bun === undefined) {
  collectDefaultMetrics({ register: gatsbyRegister })
}

const alreadyRegisted = new Set<client.Metric<string>>()
export function registerMetric(metric: client.Metric<string>) {
  if (!alreadyRegisted.has(metric)) {
    gatsbyRegister.registerMetric(metric)
    alreadyRegisted.add(metric)
  }
}
