import { createHash } from 'crypto'
import client, { registerMetric } from '../Prometheus/metrics'

export type JobLabels = Record<'job', string | number>

export const database_pool_size = new client.Gauge({
  name: 'database_pool_size',
  help: 'The number of queries that are running at the same time',
  registers: [],
  labelNames: [ 'query' ],
})

export const database_duration_seconds = new client.Histogram({
  name: 'database_duration_seconds',
  help: 'The time (in seconds) it takes for a query to complete',
  registers: [],
  labelNames: [ 'query', 'error' ],
  buckets: [ .005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10, 20, 30, 60 ],
})

registerMetric(database_pool_size)
registerMetric(database_duration_seconds)


type Chunk = string | number | (string | number)[]
const cache: Record<string, Chunk[]> = {}
export function createQueryHash(...chucks: Chunk[]) {
  const query = chucks.map(chuck => Array.isArray(chuck) ? chuck.join('::') : chuck).join(':::')
  const queryHash = createHash('sha1').update(query).digest('hex').slice(0, 6)
  if (!cache[queryHash]) {
    console.log(`new query hash "${queryHash}": ${JSON.stringify(chucks)}`)
    cache[queryHash] = chucks
  }

  return queryHash
}

export function getQueryHash(hash: string) {
  return cache[hash] || null
}

export function getQueryHashes() {
  return { ...cache }
}
