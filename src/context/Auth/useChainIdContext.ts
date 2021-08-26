import { useEffect } from 'react'
import { ChainId } from '@dcl/schemas'
import useAsyncMemo from '../../hooks/useAsyncMemo'
import useAuthContext from './useAuthContext'
import { getChainId } from './utils'

export default function useChainIdContext() {
  const [, { provider }] = useAuthContext()
  const [ chainId, state ] = useAsyncMemo<ChainId>(async () => {
    if (!provider) {
      return getChainId()
    }

    const chain = provider.request({ method: 'eth_chainId' }) as Promise<string>
    return Number(chain) as ChainId
  }, [ provider ], { initialValue: getChainId() })


  useEffect(() => {
    if (!provider) {
      return
    }

    function updateChainId (chainId: ChainId) {
      state.set(Number(chainId))
    }

    provider.on('chainChanged', updateChainId)

    return () => {
      provider.off('chainChanged', updateChainId)
    }
  }, [ provider ])

  return [ chainId, state ] as const
}
