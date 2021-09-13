import { Counter, Registry } from 'prom-client'
import { ClusterRegistry } from './cluster'
import { ClusterMessageType } from './types'

const mock = {
  addEventListener: jest.spyOn(ClusterRegistry, 'addEventListener'),
  removeEventListener: jest.spyOn(ClusterRegistry, 'removeEventListener'),
  sendMessage: jest.spyOn(ClusterRegistry, 'sendMessage'),
  getCurrentWorkerId: jest.spyOn(ClusterRegistry, 'getCurrentWorkerId'),
  getWorkers: jest.spyOn(ClusterRegistry, 'getWorkers'),
  getWorker: jest.spyOn(ClusterRegistry, 'getWorker'),
  isMaster: jest.spyOn(ClusterRegistry, 'isMaster'),
  createId: jest.spyOn(ClusterRegistry, 'createId'),
  worker: { id: 1, send: jest.fn() }
}


function mockClusterRegistry(test: (m: typeof mock) => Promise<void>) {
  return async () => {
    mock.getWorkers.mockReturnValue([ mock.worker ])
    mock.getCurrentWorkerId.mockReturnValue(1)
    mock.getWorker.mockReturnValue(mock.worker)
    mock.createId.mockReturnValue('1::1')

    await test(mock)
    mock.addEventListener.mockReset()
    mock.removeEventListener.mockReset()
    mock.sendMessage.mockReset()
    mock.getWorkers.mockReset()
    mock.isMaster.mockReset()
    mock.worker.send.mockReset()
  }
}

describe('./src/entities/Prometheus/cluster', () => {
  describe('merge', () => {
    test(`shoudl return a new instance`, mockClusterRegistry(async (mock) => {
      mock.isMaster.mockReturnValue(true)
      mock.addEventListener.mockReturnValue()

      const registry = ClusterRegistry.merge([])
      expect(registry).toBeInstanceOf(ClusterRegistry)
      expect(mock.addEventListener.mock.calls).toEqual([[registry]])

      mock.isMaster.mockReturnValue(false)
      const clusterRegistry = ClusterRegistry.merge([])
      expect(clusterRegistry).toBeInstanceOf(ClusterRegistry)
      expect(mock.addEventListener.mock.calls).toEqual([[registry], [clusterRegistry]])
    }))
  })

  describe(`metrics`, () => {
    test(`on master should return the metrics`, mockClusterRegistry(async (mock) => {
      mock.isMaster.mockReturnValue(true)
      mock.addEventListener.mockReturnValue()
      const registry = new ClusterRegistry()
      registry.registerMetric(new Counter({
        name: 'master_counter',
        help: 'description'
      }))

      expect(await registry.metrics()).toBe([
        '# HELP master_counter description',
        '# TYPE master_counter counter',
        'master_counter 0',
        '',
      ].join('\n'))
    }))

    test(`on fork should send a requet message to the master instance`, mockClusterRegistry(async (mock) => {
      mock.isMaster.mockReturnValue(false)
      mock.addEventListener.mockReturnValue()

      const registry = new ClusterRegistry()
      const secondary = new Registry()
      secondary.registerMetric(new Counter({
        name: 'fork_counter',
        help: 'description'
      }))

      const metricRequest = registry.metrics()
      expect(mock.sendMessage.mock.calls).toEqual([[
        {
          id: '1::1',
          worker: 1,
          type: ClusterMessageType.RequestMetric,
        }
      ]])

      registry.resolveForkMetrics({
        id: '1::1',
        metrics: await secondary.getMetricsAsJSON(),
        type: ClusterMessageType.ResponsetMetric
      })

      expect(await metricRequest).toBe([
        '# HELP fork_counter description',
        '# TYPE fork_counter counter',
        'fork_counter 0',
        '',
      ].join('\n'))
    }))
  })
})