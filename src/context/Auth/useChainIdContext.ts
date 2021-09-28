import useAuthContext from './useAuthContext'
import { createAsyncStateState } from '../../hooks/useAsyncState'
import { getDefaultChainId } from './utils'

const fakeState = createAsyncStateState(getDefaultChainId())

/**
 *
 * @returns
 */
export default function useChainIdContext() {
  const [, { chainId }] = useAuthContext()
  return [chainId, fakeState] as const
}
