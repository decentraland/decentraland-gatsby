import useAuth from './useAuth'
import useAsyncMemo from './useAsyncMemo'
import Catalyst from '../utils/api/Catalyst'

export default function useAvatar() {
  const [ account ] = useAuth()
  return useAsyncMemo(async () => !account ? null : Catalyst.get().getProfile(account), [ account ])
}