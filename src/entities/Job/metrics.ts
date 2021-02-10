import client, { registerMetric } from '../Prometheus/metrics'

export type JobLabels = Record<'job', string | number>

export const job_manager_pool_size = new client.Gauge({
  name: 'job_manager_pool_size',
  help: 'The number of jobs that are running at the same time',
  registers: [],
  labelNames: [ 'job' ],
})

export const job_manager_duration_seconds = new client.Histogram({
  name: 'job_manager_duration_seconds',
  help: 'The time (in seconds) it takes for a job to complete',
  registers: [],
  labelNames: [ 'job', 'error' ],
  buckets: [ .005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10, 20, 30, 60 ],
})

registerMetric(job_manager_pool_size)
registerMetric(job_manager_duration_seconds)
