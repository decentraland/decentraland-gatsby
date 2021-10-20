import type { ChainId } from '@dcl/schemas'

export type ConnectionType = 'http' | 'https' | 'ws'

export type ConnectionOptions = {
  chainId: ChainId
  type?: ConnectionType
}
