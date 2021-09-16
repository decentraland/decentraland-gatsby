import client from './metrics'

export enum ClusterMessageType {
  RequestMetric = 'request_metrics',
  ResponsetMetric = 'response_metrics',
}

export type MetricMessage = ReportMetricsRequest | ReportMetricsResponse

export type ReportMetricsRequest = {
  type: ClusterMessageType.RequestMetric
  worker: number
  id: string
}

export type ReportMetricsResponse = {
  type: ClusterMessageType.ResponsetMetric
  id: string
  metrics: client.metric[]
}
