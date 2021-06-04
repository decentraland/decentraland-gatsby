import { useState, useEffect } from 'react'
import { Provider } from 'decentraland-connect/dist/types'
import { Address } from 'web3x/address'
import { Personal } from 'web3x/personal'

type SignState = {
  message: string | null
  signature: string | null
  signing: boolean
}

export default function useSign(
  address?: string | null,
  provider?: Provider | null
) {
  const [state, setState] = useState<SignState>({
    message: null,
    signature: null,
    signing: false,
  })

  useEffect(() => {
    if (state.signing && address && provider) {
      new Personal(provider)
        .sign(state.message || '', Address.fromString(address), '')
        .then((signature) =>
          setState({ message: state.message, signature, signing: false })
        )
        .catch(() =>
          setState({ message: null, signature: null, signing: false })
        )
    }
  }, [state.signing, address, provider])

  function sign(message: string) {
    if (!state.signing) {
      setState({ message, signature: null, signing: true })
    }
  }

  return [
    { signature: state.signature, message: state.message },
    { sign, signing: state.signing },
  ]
}
