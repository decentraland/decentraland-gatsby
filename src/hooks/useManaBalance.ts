// TODO(2fd): unify `use*Balance` on a single file
import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'

import { fetchManaBalance } from '../utils/loader/manaBalance'
import useAsyncState from './useAsyncState'

export default function useManaBalance(
  account?: string | null,
  chainId?: ChainId | null
) {
  return useAsyncState(
    async () => {
      return !account || !chainId ? 0 : fetchManaBalance(account, chainId)
    },
    [account, chainId],
    {}
  )
}
