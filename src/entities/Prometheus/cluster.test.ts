import { ClusterRegistry } from './cluster'

const mock = {
  addEventListener: jest.spyOn(ClusterRegistry, 'addEventListener'),
  removeEventListener: jest.spyOn(ClusterRegistry, 'removeEventListener'),
  sendMessage: jest.spyOn(ClusterRegistry, 'sendMessage'),
  getWorkers: jest.spyOn(ClusterRegistry, 'getWorkers'),
  isMaster: jest.spyOn(ClusterRegistry, 'isMaster'),
}


function mockClusterRegistry(test: (m: typeof mock) => Promise<void>) {
  return async () => {
    await test(mock)
    mock.addEventListener.mockReset()
    mock.removeEventListener.mockReset()
    mock.sendMessage.mockReset()
    mock.getWorkers.mockReset()
    mock.isMaster.mockReset()
  }
}

describe('./src/entities/Prometheus/cluster', () => {
  test('merge', mockClusterRegistry(async (mock) => {
    mock.isMaster.mockReturnValue(true)
    mock.addEventListener.mockReturnValue()

    const registry = ClusterRegistry.merge([])
    expect(registry).toBeInstanceOf(ClusterRegistry)
    expect(mock.addEventListener.mock.calls).toEqual([[registry]])
    expect(await registry.metrics()).toBe('\n')

    mock.isMaster.mockReturnValue(false)
    const clusterRegistry = ClusterRegistry.merge([])
    expect(clusterRegistry).toBeInstanceOf(ClusterRegistry)
    expect(mock.addEventListener.mock.calls).toEqual([[registry], [clusterRegistry]])
    expect(await clusterRegistry.metrics()).toBe('\n')
  }))




})