import { ChainId, getChainName } from '@dcl/schemas/dist/dapps/chain-id'
import env from '../../utils/env'
import once from '../../utils/function/once'
import roundRobin from '../../utils/iterator/roundRobin'
import { ConnectionOptions } from './types'
import { onceWithConnectionOptions } from './utils'

const INFURA_KEYS = env('INFURA_KEYS', '')
export const getEnvironmentKeys = once(() => {
  return INFURA_KEYS.split(',').filter(Boolean)
})

export function getInfuraHttp(key: string, chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM_MAINNET:
    case ChainId.ETHEREUM_ROPSTEN:
    case ChainId.ETHEREUM_RINKEBY:
    case ChainId.ETHEREUM_GOERLI:
    case ChainId.ETHEREUM_KOVAN:
    case ChainId.MATIC_MAINNET:
    case ChainId.MATIC_MUMBAI:
      return `https://${getChainSubdomain(chainId)}.infura.io/v3/${key}`
    default:
      throw new Error(
        `Unsuported connection type "ws" for chain "${
          getChainName(chainId) || chainId
        }"`
      )
  }
}

export function getInfuraWs(key: string, chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM_MAINNET:
    case ChainId.ETHEREUM_ROPSTEN:
    case ChainId.ETHEREUM_RINKEBY:
    case ChainId.ETHEREUM_GOERLI:
    case ChainId.ETHEREUM_KOVAN:
      return `wss://${getChainSubdomain(chainId)}.infura.io/ws/v3/${key}`
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

function getChainSubdomain(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM_MAINNET:
      return 'mainnet'
    case ChainId.ETHEREUM_ROPSTEN:
      return 'ropsten'
    case ChainId.ETHEREUM_RINKEBY:
      return 'rinkeby'
    case ChainId.ETHEREUM_GOERLI:
      return 'goerli'
    case ChainId.ETHEREUM_KOVAN:
      return 'kovan'
    case ChainId.MATIC_MAINNET:
      return 'polygon-mainnet'
    case ChainId.MATIC_MUMBAI:
      return 'polygon-mumbai'
    default:
      throw new Error(`Unsupported chain id: "${chainId}"`)
  }
}

const getEnvironmentKeyRoundRoby = onceWithConnectionOptions(
  ({ chainId, type }: ConnectionOptions) => {
    return roundRobin(
      getEnvironmentKeys().map((key) => {
        switch (type) {
          case 'ws':
            return getInfuraWs(key, chainId)
          default:
            return getInfuraHttp(key, chainId)
        }
      })
    )
  }
)

export const getEnvironmentKey = (options: ConnectionOptions) =>
  getEnvironmentKeyRoundRoby(options)()
