import { JsonRpcProvider } from '@ethersproject/providers'

import { getRPCUrl } from '../utils'

import type { ChainId } from '@dcl/schemas/dist/dapps/chain-id'

export default class DecentralandProvider extends JsonRpcProvider {
  constructor(chainId: ChainId) {
    super(
      {
        url: getRPCUrl(chainId),
        headers: { Referer: 'https://decentraland.org' },
      },
      chainId
    )
  }
}
