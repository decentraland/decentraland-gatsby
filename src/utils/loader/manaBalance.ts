import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { buildWallet } from 'decentraland-dapps/dist/modules/wallet/utils/buildWallet'
import { ManaBalancesProps } from 'decentraland-ui/dist/components/UserMenu/ManaBalances/ManaBalances.types'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import rollbar from '../development/rollbar'
import segment from '../development/segment'
import sentry from '../development/sentry'
import Loader from './Loader'

export async function fetchManaBalance(
  address: string,
  chainId: ChainId
): Promise<ManaBalancesProps['manaBalances']> {
  if (!isEthereumAddress(address)) {
    return {}
  }

  try {
    const { networks } = await buildWallet(chainId)
    const manaBalances: ManaBalancesProps['manaBalances'] = {}
    const networkList = [Network.ETHEREUM, Network.MATIC]
    for (const network of networkList as [Network.ETHEREUM, Network.MATIC]) {
      const networkData = networks[network]
      if (networkData) {
        manaBalances[network] = networks[network].mana
      }
    }

    return manaBalances
  } catch (err) {
    console.error(err)
    rollbar((rollbar) => rollbar.error(err))
    sentry((sentry) => sentry.captureException(err))
    segment((analytics) =>
      analytics.track('error', {
        ...err,
        message: err.message,
        stack: err.stack,
      })
    )
    return {}
  }
}

function mapChainIdToNetwork(chainId: ChainId): Network {
  switch (chainId) {
    case ChainId.ETHEREUM_MAINNET:
    case ChainId.ETHEREUM_SEPOLIA:
      return Network.ETHEREUM
    case ChainId.MATIC_MAINNET:
    case ChainId.MATIC_AMOY:
      return Network.MATIC
    default:
      return Network.ETHEREUM
  }
}

function createBalanceLoader(chainId: ChainId) {
  return new Loader(async (address: string) => {
    const manaBalances = await fetchManaBalance(address, chainId)
    return (manaBalances?.[mapChainIdToNetwork(chainId)] ?? 0) as number
  })
}

const cache = new Map<ChainId, Loader<number>>()

export default function manaBalance(chainId: ChainId): Loader<number> {
  if (!cache.has(chainId)) {
    cache.set(chainId, createBalanceLoader(chainId))
  }

  return cache.get(chainId)!
}
