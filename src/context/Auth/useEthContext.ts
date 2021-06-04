import useEth from '../../hooks/useEth'
import useAuthContext from './useAuthContext'

export default function useEthContext() {
  const [, { provider }] = useAuthContext()
  return useEth(provider)
}
