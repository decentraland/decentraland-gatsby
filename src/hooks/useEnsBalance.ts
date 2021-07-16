import { ChainId, fetchEnsBalance } from '../utils/loader/ensBalance'
import useAsyncMemo from './useAsyncMemo'

export default function useNameBalance(
  account?: string | null,
  chainId?: ChainId | null
) {
  return useAsyncMemo(
    async () => {
      return !account || !chainId ? 0 : fetchEnsBalance(account, chainId)
    },
    [account, chainId],
    { initialValue: 0 }
  )
}
