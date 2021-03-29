import { useEffect, useState } from 'react'
import type { ChainId } from '@dcl/schemas'
import { getCurrentChainId, getDefaultChainId } from '../context/Auth/utils'

let CURRENT_CHAIN_ID = getDefaultChainId()
let DETECTED_CHAIN_ID: ChainId | null = null

export default function useChainId() {
  const [ chainId, setChainId ] = useState(DETECTED_CHAIN_ID || CURRENT_CHAIN_ID)

  // Detect injected chain id
  useEffect(() => {
    if (DETECTED_CHAIN_ID == null) {
      DETECTED_CHAIN_ID = getCurrentChainId()
    }

    if (DETECTED_CHAIN_ID !== chainId) {
      setChainId(getCurrentChainId())
    }
  }, [])

  return chainId
}