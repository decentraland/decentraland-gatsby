import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { Network } from '@dcl/schemas/dist/dapps/network'

import manaBalance from './manaBalance'

jest.mock('decentraland-dapps/dist/modules/wallet/utils/buildWallet', () => ({
  buildWallet: jest.fn(async () => {
    return {
      networks: {
        [Network.ETHEREUM]: {
          mana: 100,
        },
      },
    }
  }),
}))

describe('manaBalance', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  test('should load mana balance', async () => {
    const balance = await manaBalance(ChainId.ETHEREUM_MAINNET).load(
      '0x9a6ebe7e2a7722f8200d0ffb63a1f6406a0d7dce'
    )
    expect(balance).toBeGreaterThan(0)
  })
})
