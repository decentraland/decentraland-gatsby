import useAuthContext from './useAuthContext'
import useAsyncMemo from '../../hooks/useAsyncMemo'
import profile from '../../utils/loader/profile'

export default function useProfileContext() {
  const [ account ] = useAuthContext()
  return useAsyncMemo(async () => !account ? null : profile.load(account), [ account ])
}