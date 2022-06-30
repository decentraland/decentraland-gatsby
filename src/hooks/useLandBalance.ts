// TODO(2fd): unify `use*Balance` on a single file
import { ChainId, fetchLandBalance } from '../utils/loader/landBalance'
import useAsyncState from './useAsyncState'

export default function useLandBalance(
  account?: string | null,
  chainId?: ChainId | null
) {
  return useAsyncState(
    async () => {
      return !account || !chainId ? 0 : fetchLandBalance(account, chainId)
    },
    [account, chainId],
    { initialValue: 0 }
  )
}
