import cluster from 'cluster'
import client, { AggregatorRegistry } from 'prom-client'
import { registry } from './metrics'
import { handleRaw } from '../Route/handle'
import routes from '../Route/routes'
import { withPrometheusToken } from './middleware'
import logger from '../Development/logger'

const PROMETHEUS_REGISTRIES = [registry, client.register]
let PROMETHEUS_REGISTRY: client.Registry | null = null

export default routes((router) => {
  router.get(
    '/metrics',
    withPrometheusToken({ optional: true }),
    handleRaw(getAllMetrics, client.register.contentType)
  )

  if (cluster.isWorker) {
    handleMetricsRequest()
  }
})

export function getRegistry() {
  if (!PROMETHEUS_REGISTRY) {
    PROMETHEUS_REGISTRY = client.Registry.merge(PROMETHEUS_REGISTRIES)
  }

  return PROMETHEUS_REGISTRY!
}

export function exposeRegistry(registry: client.Registry) {
  if (!PROMETHEUS_REGISTRIES.includes(registry)) {
    PROMETHEUS_REGISTRIES.push(registry)
    PROMETHEUS_REGISTRY = null
  }

  return PROMETHEUS_REGISTRIES.length
}

export async function getAllMetrics() {
  if (cluster.isWorker) {
    return getClusterMetrics()
  }

  return getMetrics()
}

export enum ClusterMessageType {
  RequestMetric = 'request_metrics',
  ResponsetMetric = 'response_metrics',
}

export type ReportMetricsRequest = {
  type: ClusterMessageType.RequestMetric,
  worker: number,
  id: string,
}

export type ReportMetricsResponse = {
  type: ClusterMessageType.ResponsetMetric,
  id: string,
  metrics: client.metric[]
}

let REQUEST_ID = 0
export async function getClusterMetrics() {
  const message: ReportMetricsRequest = {
    type: ClusterMessageType.RequestMetric,
    worker: cluster.worker.id,
    id: [cluster.worker.id, REQUEST_ID++].join(':')
  }

  return requestMetrics(message)
}

const HANDLE_METRICS = new Map<string, { metrics: client.metric[], pending: number, callback: (data: string) => void }>()
function handleMetricsRequest() {
  process.on('message', (message: ReportMetricsRequest | ReportMetricsResponse) => {
    switch (message.type) {
      case ClusterMessageType.RequestMetric:
        return reportMetrics(message)
      case ClusterMessageType.ResponsetMetric:
        const handler = HANDLE_METRICS.get(message.id)
        if (handler) {
          handler.pending = handler.pending - 1
          for (const metric of message.metrics) {
            handler.metrics.push(metric)
          }

          if (handler.pending === 0) {
            HANDLE_METRICS.delete(message.id)
            const aggregated = AggregatorRegistry.aggregate(handler.metrics)
            aggregated.metrics()
              .then(metrics => handler.callback(metrics))
              .catch((err: Error) => {
                logger.error(`Error aggregating metrics: ${err.message}`, err)
                handler.callback('')
              })
          }
        }
        return null
    }
  })
}

export async function requestMetrics(message: ReportMetricsRequest) {
  const workers = Object.values(cluster.workers)
    .filter(Boolean) as cluster.Worker[]

  const request = new Promise<string>((resolve) => {
    HANDLE_METRICS.set(message.id, {
      metrics: [],
      pending: workers.length,
      callback: resolve
    })
  })

  for (const worker of workers) {
    worker.send(message)
  }

  return request
}

export async function reportMetrics(message: ReportMetricsRequest) {
  const worker = cluster.workers[message.worker]
  if (worker) {
    const registry = getRegistry()
    const metrics = await registry.getMetricsAsJSON()
      .catch((err: Error) => {
        logger.error(err.message)
        return []
      })

    const report: ReportMetricsResponse = {
      type: ClusterMessageType.ResponsetMetric,
      id: message.id,
      metrics
    }

    worker.send(report)
  }
}

export async function getMetrics() {
  return getRegistry().metrics()
}
