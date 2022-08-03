import { ChainId, getChainName } from '@dcl/schemas/dist/dapps/chain-id'
import { ConnectionOptions } from '../types'
import { onceWithConnectionOptions } from '../utils'

const Endpoints = {
  [ChainId.ETHEREUM_MAINNET]: 'mainnet',
  [ChainId.ETHEREUM_ROPSTEN]: 'ropsten',
  [ChainId.ETHEREUM_RINKEBY]: 'rinkeby',
  [ChainId.ETHEREUM_GOERLI]: 'goerli',
  [ChainId.ETHEREUM_KOVAN]: 'kovan',
  [ChainId.MATIC_MAINNET]: 'polygon',
  [ChainId.MATIC_MUMBAI]: 'mumbai',
} as const

export function getRpcHttp(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM_MAINNET:
    case ChainId.ETHEREUM_ROPSTEN:
    case ChainId.ETHEREUM_RINKEBY:
    case ChainId.ETHEREUM_GOERLI:
    case ChainId.ETHEREUM_KOVAN:
    case ChainId.MATIC_MAINNET:
    case ChainId.MATIC_MUMBAI:
      return `https://rpc.decentraland.org/${Endpoints[chainId]}`
    default:
      throw new Error(
        `Unsuported connection type "ws" for chain "${
          getChainName(chainId) || chainId
        }"`
      )
  }
}

export function getRpcWs(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM_MAINNET:
    case ChainId.ETHEREUM_ROPSTEN:
    case ChainId.ETHEREUM_RINKEBY:
    case ChainId.ETHEREUM_GOERLI:
    case ChainId.ETHEREUM_KOVAN:
      return `wss://rpc.decentraland.org/${Endpoints[chainId]}`
    case ChainId.MATIC_MAINNET:
    case ChainId.MATIC_MUMBAI:
    default:
      throw new Error(
        `Unsuported connection type "ws" for chain "${
          getChainName(chainId) || chainId
        }"`
      )
  }
}

const getEnvironmentKeyRoundRoby = onceWithConnectionOptions(
  ({ chainId, type }: ConnectionOptions) =>
    type === 'ws' ? getRpcHttp(chainId) : getRpcWs(chainId)
)

export const getEnvironmentKey = (options: ConnectionOptions) =>
  getEnvironmentKeyRoundRoby(options)
