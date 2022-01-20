import type { ChainId } from '@dcl/schemas/dist/dapps/chain-id'

export type ConnectionType = 'http' | 'https' | 'ws'

export type ConnectionOptions = {
  chainId: ChainId
  type?: ConnectionType
}
