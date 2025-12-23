// TODO(2fd): unify `use*Balance` on a single file
import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { Network } from '@dcl/schemas/dist/dapps/network'

import useAsyncState from './useAsyncState'
import { fetchManaBalance } from '../utils/loader/manaBalance'

type ManaBalances = Partial<Record<Network, number>>

export default function useManaBalance(
  account?: string | null,
  chainId?: ChainId | null
): ReturnType<typeof useAsyncState<ManaBalances | number>> {
  return useAsyncState(
    async () => {
      return !account || !chainId ? 0 : fetchManaBalance(account, chainId)
    },
    [account, chainId],
    {}
  )
}
