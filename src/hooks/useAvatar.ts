import useAuth from './useAuth'
import useAsyncMemo from './useAsyncMemo'
import profile from '../utils/loader/profile'

export default function useAvatar() {
  const [ account ] = useAuth()
  return useAsyncMemo(async () => !account ? null : profile.load(account), [ account ])
}