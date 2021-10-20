import { HttpProvider } from 'web3x/providers/http'
import { WebsocketProvider } from 'web3x/providers/ws'
import roundRobin from '../../../utils/iterator/roundRobin'
import { getEnvironmentKeys, getInfuraHttp, getInfuraWs } from '../keys'
import { ConnectionOptions } from '../types'
import { onceWithConnectionOptions } from '../utils'

function createProvider(key: string, { chainId, type }: ConnectionOptions) {
  switch (type) {
    case 'ws':
      return new WebsocketProvider(getInfuraWs(key, chainId))
    case 'http':
    case 'https':
    default:
      return new HttpProvider(getInfuraHttp(key, chainId))
  }
}

const getProviderRounRobin = onceWithConnectionOptions(
  ({ chainId, type }: ConnectionOptions) => {
    return roundRobin(
      getEnvironmentKeys().map((key) => createProvider(key, { chainId, type }))
    )
  }
)

export const getProvider = (options: ConnectionOptions) =>
  getProviderRounRobin(options)()
