import { HttpProvider } from 'web3x/providers/http'
import { WebsocketProvider } from 'web3x/providers/ws'
import { getRpcHttp, getRpcWs } from '../decentraland/keys'
import { ConnectionOptions } from '../types'
import { onceWithConnectionOptions } from '../utils'

function createProvider({ chainId, type }: ConnectionOptions) {
  switch (type) {
    case 'ws':
      return new WebsocketProvider(getRpcWs(chainId))
    case 'http':
    case 'https':
    default:
      return new HttpProvider(getRpcHttp(chainId))
  }
}

const getProviderRounRobin = onceWithConnectionOptions(
  (options: ConnectionOptions) => createProvider(options)
)

export const getProvider = (options: ConnectionOptions) =>
  getProviderRounRobin(options)
