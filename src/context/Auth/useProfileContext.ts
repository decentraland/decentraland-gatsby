import useAsyncState from '../../hooks/useAsyncState'
import profile from '../../utils/loader/profile'
import useAuthContext from './useAuthContext'

export default function useProfileContext() {
  const [account] = useAuthContext()
  return useAsyncState(
    async () => (!account ? null : profile.load(account)),
    [account]
  )
}
