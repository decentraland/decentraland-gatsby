import client from 'prom-client'
import { registerMetric } from '../Prometheus/metrics'

export const http_request_pool_size = new client.Gauge({
  name: 'http_request_pool_size',
  help: 'The number of requests that are running at the same time',
  registers: [],
  labelNames: ['method', 'handler'],
})

export const http_request_duration_seconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'The time (in seconds) it takes for a request to be handled',
  registers: [],
  labelNames: ['method', 'handler', 'statusCode'],
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

registerMetric(http_request_pool_size)
registerMetric(http_request_duration_seconds)
