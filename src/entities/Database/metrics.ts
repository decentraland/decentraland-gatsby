import client, { registerMetric } from '../Prometheus/metrics'

export type JobLabels = Record<'job', string | number>

export const database_pool_size = new client.Gauge({
  name: 'database_pool_size',
  help: 'The number of queries that are running at the same time',
  registers: [],
  labelNames: ['query'],
})

export const database_duration_seconds = new client.Histogram({
  name: 'database_duration_seconds',
  help: 'The time (in seconds) it takes for a query to complete',
  registers: [],
  labelNames: ['query', 'error'],
  buckets: [
    0.005,
    0.01,
    0.025,
    0.05,
    0.1,
    0.25,
    0.5,
    1,
    2.5,
    5,
    10,
    20,
    30,
    60,
  ],
})

registerMetric(database_pool_size)
registerMetric(database_duration_seconds)
