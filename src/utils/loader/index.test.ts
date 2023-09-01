import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'

import { fetchEnsBalance } from './ensBalance'
import { fetchEstateBalance } from './estateBalance'
import { fetchLandBalance } from './landBalance'
import manaBalance from './manaBalance'

describe('manaBalance', () => {
  test('should load mana balance', async () => {
    const balance = await manaBalance(ChainId.ETHEREUM_MAINNET).load(
      '0x9a6ebe7e2a7722f8200d0ffb63a1f6406a0d7dce'
    )
    expect(balance).toBeGreaterThan(0)
  })
})

describe('fetchEnsBalance', () => {
  test('should load ens balance', async () => {
    const balance = await fetchEnsBalance(
      '0x4eac6325e1dbf1ac90434d39766e164dca71139e',
      ChainId.ETHEREUM_MAINNET
    )
    expect(balance).toBeGreaterThan(0)
  })
})

describe('fetchLandBalance', () => {
  test('should load ens balance', async () => {
    const balance = await fetchLandBalance(
      '0x5188e308fee25ac49c10f9fd9270d953c4822ce5',
      ChainId.ETHEREUM_MAINNET
    )
    expect(balance).toBeGreaterThan(0)
  })
})

describe('fetchEstateBalance', () => {
  test('should load ens balance', async () => {
    const [estateBalance, landBalance] = await fetchEstateBalance(
      '0x5188e308fee25ac49c10f9fd9270d953c4822ce5',
      ChainId.ETHEREUM_MAINNET
    )
    expect(estateBalance).toBeGreaterThan(0)
    expect(landBalance).toBeGreaterThan(0)
  })
})
