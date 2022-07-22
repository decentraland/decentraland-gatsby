import { Counter, Histogram } from 'prom-client'

import { registerMetric } from '../Prometheus/metrics'

export const http_request_duration_seconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'The time (in seconds) it takes for a request to be handled',
  registers: [],
  labelNames: ['method', 'handler', 'code'],
  buckets: [
    0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 20, 30, 60,
  ],
})

// bucket sizes: 0, 8Kb, 128Kb, 512Kb, 1Mb, 2Mb, 5Mb, 10Mb, 20Mb
export const http_request_size_bytes = new Histogram({
  name: 'http_request_size_bytes',
  help: 'Duration of HTTP requests size in bytes',
  registers: [],
  labelNames: ['method', 'handler', 'code'],
  buckets: [
    0, 8192, 131072, 524288, 1048576, 2097152, 5242880, 10485760, 20971520,
  ],
})

export const http_requests_total = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  registers: [],
  labelNames: ['method', 'handler', 'code'],
})

registerMetric(http_request_duration_seconds)
registerMetric(http_request_size_bytes)
registerMetric(http_requests_total)
