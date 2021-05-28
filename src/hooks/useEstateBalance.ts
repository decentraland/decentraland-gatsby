import { ChainId, fetchEstateBalance } from "../utils/loader/estateBalance";
import useAsyncMemo from "./useAsyncMemo";

export default function useManaBalance(account?: string | null, chainId?: ChainId | null) {
  const [ [estates, lands], state ] = useAsyncMemo(async () => {
    if (!account || !chainId) {
      return [0, 0] as [number, number]
    }

    return fetchEstateBalance(account, chainId)
  }, [ account, chainId ], { initialValue: [0, 0] as [number, number] })

  return [ estates, lands, state ]
}