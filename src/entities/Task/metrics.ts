import client, { registerMetric } from '../Prometheus/metrics'

export type TaskLabels = Record<'task', string | number>

export const task_manager_pool_size = new client.Gauge({
  name: 'task_manager_pool_size',
  help: 'The number of tasks that are running at the same time',
  registers: [],
  labelNames: ['runner', 'task'],
})

export const task_manager_duration_seconds = new client.Histogram({
  name: 'task_manager_duration_seconds',
  help: 'The time (in seconds) it takes for a task to complete',
  registers: [],
  labelNames: ['runner', 'task', 'error'],
  buckets: [
    0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 20, 30, 60,
  ],
})

registerMetric(task_manager_pool_size)
registerMetric(task_manager_duration_seconds)
