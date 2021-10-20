import type { ChainId } from '@dcl/schemas'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getEnvironmentKey } from '../keys'

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
