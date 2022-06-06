import { JsonRpcProvider } from '@ethersproject/providers'

import { getEnvironmentKey } from '../keys'

import type { ChainId } from '@dcl/schemas/dist/dapps/chain-id'

export default class SignerProvider extends JsonRpcProvider {
  constructor(chainId: ChainId) {
    super(
      {
        url: getEnvironmentKey({ chainId, type: 'https' }),
        headers: { Referer: 'https://decentraland.org' },
      },
      chainId
    )
  }
}
