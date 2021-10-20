import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
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
