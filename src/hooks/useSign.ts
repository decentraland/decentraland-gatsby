import { useState, useEffect } from 'react'
import { Provider } from 'decentraland-connect/dist/types'
import { Address } from 'web3x/address'
import { Personal } from 'web3x/personal'
import logger from '../entities/Development/logger'

type SignState = {
  message: string | null
  signature: string | null
  signing: boolean
  error: Error | null
}

export default function useSign(
  address?: string | null,
  provider?: Provider | null
) {
  const [state, setState] = useState<SignState>({
    message: null,
    signature: null,
    signing: false,
    error: null
  })

  useEffect(() => {
    if (state.signing && address && provider) {
      new Personal(provider)
        .sign(state.message || '', Address.fromString(address), '')
        .then((signature) =>
          setState({ message: state.message, signature, signing: false, error: null })
        )
        .catch((error) => {
          logger.error(`Error signing message: ${state.message || '""'}`)
          setState({ message: null, signature: null, signing: false, error })
        })
    }
  }, [state.signing, address, provider])

  function sign(message: string) {
    if (!state.signing) {
      setState({ message, signature: null, signing: true, error: null })
    }
  }

  return [
    { signature: state.signature, message: state.message },
    { sign, signing: state.signing },
  ]
}
