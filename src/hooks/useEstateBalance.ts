import { ChainId, fetchEstateBalance } from '../utils/loader/estateBalance'
import useAsyncState from './useAsyncState'

export default function useEstateBalance(
  account?: string | null,
  chainId?: ChainId | null
) {
  const [[estates, lands], state] = useAsyncState(
    async () => {
      if (!account || !chainId) {
        return [0, 0] as [number, number]
      }

      return fetchEstateBalance(account, chainId)
    },
    [account, chainId],
    { initialValue: [0, 0] as [number, number] }
  )

  return [estates, lands, state] as const
}
