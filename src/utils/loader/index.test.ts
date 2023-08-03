import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'

import { fetchEnsBalance } from './ensBalance'
import { fetchEstateBalance } from './estateBalance'
import { fetchLandBalance } from './landBalance'
import manaBalance from './manaBalance'

describe('manaBalance', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: {
          accounts: [
            {
              mana: 1,
            },
          ],
        },
      }),
    } as unknown as Response)
  })
  test('should load mana balance', async () => {
    const balance = await manaBalance(ChainId.ETHEREUM_MAINNET).load(
      '0x9a6ebe7e2a7722f8200d0ffb63a1f6406a0d7dce'
    )
    expect(balance).toBeGreaterThan(0)
  })
})

describe('fetchEnsBalance', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: {
          nfts: [
            {
              tokenId: 'aTokenId',
            },
          ],
        },
      }),
    } as unknown as Response)
  })
  test('should load ens balance', async () => {
    const balance = await fetchEnsBalance(
      '0x4eac6325e1dbf1ac90434d39766e164dca71139e',
      ChainId.ETHEREUM_MAINNET
    )
    expect(balance).toBeGreaterThan(0)
  })
})

describe('fetchLandBalance', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: {
          nfts: [
            {
              tokenId: 'aTokenId',
            },
          ],
        },
      }),
    } as unknown as Response)
  })

  test('should load ens balance', async () => {
    const balance = await fetchLandBalance(
      '0x4eac6325e1dbf1ac90434d39766e164dca71139e',
      ChainId.ETHEREUM_MAINNET
    )
    expect(balance).toBeGreaterThan(0)
  })
})

describe('fetchEstateBalance', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: {
          nfts: [{ searchEstateSize: 1 }],
        },
      }),
    } as unknown as Response)
  })

  test('should load ens balance', async () => {
    const [estateBalance, landBalance] = await fetchEstateBalance(
      '0x4eac6325e1dbf1ac90434d39766e164dca71139e',
      ChainId.ETHEREUM_MAINNET
    )
    expect(estateBalance).toBeGreaterThan(0)
    expect(landBalance).toBeGreaterThan(0)
  })
})
