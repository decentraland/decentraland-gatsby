import { JsonRpcProvider } from '@ethersproject/providers'
import { signTypedData_v4 } from 'eth-sig-util'

import { getEnvironmentKey } from '../keys'

import type { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import type { Wallet } from '@ethersproject/wallet'

export default class SignerProvider extends JsonRpcProvider {
  wallet: Wallet

  constructor(wallet: Wallet, chainId: ChainId) {
    super(
      {
        url: getEnvironmentKey({ chainId, type: 'https' }),
        headers: { Referer: 'https://decentraland.org' },
      },
      chainId
    )
    this.wallet = wallet
  }

  async send(method: string, params: any[]): Promise<any> {
    switch (method) {
      case 'eth_requestAccounts':
        return this.wallet ? [this.wallet.address.toString().toLowerCase()] : []

      case 'eth_signTypedData_v4': {
        const [signer, raw] = (params || ['', '']) as [string, string]
        if (!this.wallet) {
          throw new Error(`Empty account`)
        }

        if (
          this.wallet.address.toString().toLowerCase() !==
          signer.toString().toLowerCase()
        ) {
          throw new Error(
            `Invalid account: "${this.wallet.address.toString().toLowerCase()}"`
          )
        }

        const data = JSON.parse(raw)
        return signTypedData_v4(
          Buffer.from(this.wallet.privateKey.slice(2), 'hex'),
          { data }
        )
      }
      default:
        return super.send(method, params)
    }
  }
}
