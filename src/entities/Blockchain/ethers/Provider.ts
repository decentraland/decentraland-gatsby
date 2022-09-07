import { JsonRpcProvider } from '@ethersproject/providers'
import { RPC_URLS } from 'decentraland-connect/dist/connectors/NetworkConnector'

import type { ChainId } from '@dcl/schemas/dist/dapps/chain-id'

export default class DecentralandProvider extends JsonRpcProvider {
  constructor(chainId: ChainId) {
    super(
      {
        url: RPC_URLS[chainId],
        headers: { Referer: 'https://decentraland.org' },
      },
      chainId
    )
  }
}
