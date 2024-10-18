import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { getRpcUrls } from 'decentraland-connect'

import { ConnectionOptions, ConnectionType } from './types'

export type FuncWithConnectionOptions<T> = (options: ConnectionOptions) => T
export function onceWithConnectionOptions<T>(
  fun: FuncWithConnectionOptions<T>
): FuncWithConnectionOptions<T> {
  const CACHE: Record<ConnectionType, Record<ChainId, T>> = {} as any

  return ({ chainId, type }: ConnectionOptions) => {
    if (!type || type === 'http') {
      type = 'https'
    }

    if (!CACHE[type]) {
      CACHE[type] = {} as any
    }

    if (!CACHE[type][chainId]) {
      CACHE[type][chainId] = fun({ chainId, type })
    }

    return CACHE[type][chainId]
  }
}

type SupportedChainIds = keyof ReturnType<typeof getRpcUrls>
export function getRPCUrl(chainId: ChainId) {
  const rpcUrls = getRpcUrls(ProviderType.NETWORK)

  if (!(chainId in rpcUrls)) {
    throw new Error(`ChainId ${chainId} not supported`)
  }

  return getRpcUrls(ProviderType.NETWORK)[chainId as SupportedChainIds]
}
