import { ChainId, fetchManaBalance } from '../utils/loader/manaBalance'
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
    { initialValue: 0 }
  )
}
