import { ChainId, fetchManaBalance } from "../utils/loader/manaBalance";
import useAsyncMemo from "./useAsyncMemo";

export default function useManaBalance(account?: string | null, chainId?: ChainId | null) {
  return useAsyncMemo(async () => {
    return !account || !chainId ? 0 : fetchManaBalance(account, chainId)
  }, [ account, chainId ])
}