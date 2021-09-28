import { ChainId, fetchEnsBalance } from '../utils/loader/ensBalance'
import useAsyncState from './useAsyncState'

export default function useNameBalance(
  account?: string | null,
  chainId?: ChainId | null
) {
  return useAsyncState(
    async () => {
      return !account || !chainId ? 0 : fetchEnsBalance(account, chainId)
    },
    [account, chainId],
    { initialValue: 0 }
  )
}
