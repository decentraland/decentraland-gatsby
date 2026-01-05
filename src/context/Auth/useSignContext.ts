import useAuthContext from './useAuthContext'
import useSign from '../../hooks/useSign'

export default function useSignContext() {
  const [address, state] = useAuthContext()
  return useSign(address, state.provider)
}
