import { ChainId, getChainName } from '@dcl/schemas'
import { HttpProvider } from 'web3x/providers/http'
import { WebsocketProvider } from 'web3x/providers/ws'
import env from '../../utils/env'
import once from '../../utils/function/once'
import roundRobin from '../../utils/iterator/roundRobin'

const INFURA_KEYS = env('INFURA_KEYS', '')
export const getEnvironmentKeys = once(() => {
  return INFURA_KEYS.split(',').filter(Boolean)
})

export type ConnectionType = 'http' | 'https' | 'ws'

export type ConnectionOptions = {
  chainId: ChainId
  type?: ConnectionType
}

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

function getInfuraHttp(key: string, chainId: ChainId) {
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

function getInfuraWs(key: string, chainId: ChainId) {
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

const PROVIDERS: Record<
  ConnectionType,
  Record<ChainId, () => HttpProvider | WebsocketProvider>
> = {} as any
const getProviderRounRobin = ({ chainId, type }: ConnectionOptions) => {
  if (!type || type === 'http') {
    type = 'https'
  }

  if (!PROVIDERS[type]) {
    PROVIDERS[type] = {} as any
  }

  if (!PROVIDERS[type][chainId]) {
    PROVIDERS[type][chainId] = roundRobin(
      getEnvironmentKeys().map((key) => createProvider(key, { chainId, type }))
    )
  }

  return PROVIDERS[type][chainId]
}

export const getProvider = (options: ConnectionOptions) =>
  getProviderRounRobin(options)()
