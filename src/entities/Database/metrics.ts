import client, { registerMetric } from '../Prometheus/metrics'

export type JobLabels = Record<'job', string | number>

export const database_pool_size = new client.Gauge({
  name: 'database_pool_size',
  help: 'The number of queries that are running at the same time',
  registers: [],
  labelNames: ['table', 'method', 'props'],
})

export const database_duration_seconds = new client.Histogram({
  name: 'database_duration_seconds',
  help: 'The time (in seconds) it takes for a query to complete',
  registers: [],
  labelNames: ['table', 'method', 'props', 'error'],
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


export async function withDatabaseMetrics<T>(
  exec: () => Promise<T>,
  params: { table: string, method: string, props: string }
): Promise<T> {
  database_pool_size.inc(params)
  const complete = database_duration_seconds.startTimer(params)
  try {
    const result = await exec()
    database_pool_size.dec(params)
    complete({ error: 0 })
    return result
  } catch (err) {
    database_pool_size.dec(params)
    complete({ error: 1 })
    Object.assign(err, params)
    throw err
  }
}