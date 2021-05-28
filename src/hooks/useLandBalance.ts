import { ChainId, fetchLandBalance } from "../utils/loader/landBalance";
import useAsyncMemo from "./useAsyncMemo";

export default function useManaBalance(account?: string | null, chainId?: ChainId | null) {
  return useAsyncMemo(async () => {
    return !account || !chainId ? 0 : fetchLandBalance(account, chainId)
  }, [ account, chainId ], { initialValue: 0 })
}