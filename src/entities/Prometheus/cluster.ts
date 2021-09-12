import cluster from 'cluster'
import client, { Registry, AggregatorRegistry } from 'prom-client'
import logger from '../Development/logger'
import { MetricMessage, ClusterMessageType, ReportMetricsRequest, ReportMetricsResponse } from './types'

let REQUEST_ID = 0

export class ClusterRegistry extends Registry {

  static merge(registers: Registry[]): Registry {
    if (cluster.isMaster) {
      return super.merge(registers)
    }

    const clusterRegistry = new ClusterRegistry()
    for (const registry of registers) {
      const metrics: client.Metric<any>[]= registry.getMetricsAsArray() as any
      for (const metric of metrics) {
        clusterRegistry.registerMetric(metric)
      }
    }

    return clusterRegistry
  }

  forkRequests = new Map<string, (metrics: string) => void>()
  masterRequests = new Map<string, { metrics: client.metric[], worker: number, pending: number }>()

  constructor() {
    super()
    this.listen()
  }


  handleMasterMessages = (message: MetricMessage) => {
    switch (message.type) {
      case ClusterMessageType.RequestMetric:
        return this.forwardRequestMetrics(message)
      case ClusterMessageType.ResponsetMetric:
        return this.collectMetrics(message)
    }
  }

  handleForkMessages = (message: MetricMessage) => {
    switch (message.type) {
      case ClusterMessageType.RequestMetric:
        return this.reportForkMetrics(message)
      case ClusterMessageType.ResponsetMetric:
        return this.resolveForkMetrics(message)
    }
  }

  get handler() {
    return cluster.isMaster
      ? this.handleMasterMessages
      : this.handleForkMessages
  }

  listen() {
    process.on('message', this.handler)
  }

  close() {
    process.off('message', this.handler)
  }

  async metrics() {
    if (cluster.isMaster) {
      return ''
    }

    const id = [ cluster.worker.id, REQUEST_ID++ ].join('::')
    const req = new Promise<string>((resolve) => {
      this.forkRequests.set(id, resolve)
    })

    return req
  }

  reportForkMetrics(message: ReportMetricsRequest) {
    const metrics = this.getMetricsAsJSON()
      .catch((err: Error) => {
        logger.error(`Error getting metrics as JSON: ${err.message}`, err)
        return [] as client.metric[]

      })

    return metrics
      .then(metrics => {
        const report: ReportMetricsResponse = {
          type: ClusterMessageType.ResponsetMetric,
          id: message.id,
          metrics
        }

        if (process.send) {
          process.send(report)
        }
      })
  }

  resolveForkMetrics(message: ReportMetricsResponse) {
    const resolve = this.forkRequests.get(message.id)
    if (resolve) {
      this.forkRequests.delete(message.id)
      const registry = AggregatorRegistry.aggregate(message.metrics)
      registry.metrics()
        .then((metrics) => resolve(metrics))
        .catch((err: Error) => {
          logger.error(`Error resolving metrics: ${err.message}`, err)
          resolve('')
        })
    }
  }

  forwardRequestMetrics(message: ReportMetricsRequest) {
    if (cluster.isWorker) {
      return
    }

    const workers = Object.values(cluster.workers).filter(Boolean) as cluster.Worker[]
    const pending = workers.length
    if (pending === 0) {
      return
    }

    const worker = message.worker
    const metrics = [] as client.metric[]
    this.masterRequests.set(message.id, { pending, worker, metrics })

    for (const fork of workers) {
      fork.send(message)
    }
  }

  collectMetrics(message: ReportMetricsResponse) {
    const task = this.masterRequests.get(message.id)
    if (task) {
      task.pending--
      for (const metric of message.metrics) {
        task.metrics.push(metric)
      }

      if (task.pending === 0) {
        this.masterRequests.delete(message.id)
        const fork = cluster.workers[task.worker]
        if (fork) {
          fork.send({
            id: message.id,
            type: ClusterMessageType.ResponsetMetric,
            metrics: task.metrics
          })
        }
      }
    }
  }
}