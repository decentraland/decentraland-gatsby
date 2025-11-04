// TODO(2fd): unify `use*Balance` on a single file
import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { Network } from '@dcl/schemas/dist/dapps/network'

import { fetchManaBalance } from '../utils/loader/manaBalance'
import useAsyncState, { type AsyncStateResult } from './useAsyncState'

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

export default function useManaBalance(
  account?: string | null,
  chainId?: ChainId | null
): AsyncStateResult<number> {
  return useAsyncState(
    async () => {
      if (!account || !chainId) {
        return 0
      }
      const manaBalances = await fetchManaBalance(account, chainId)
      const network = mapChainIdToNetwork(chainId)
      return (manaBalances?.[network] ?? 0) as number
    },
    [account, chainId],
    {}
  )
}
