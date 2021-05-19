import { useMemo } from 'react'
import { Eth } from 'web3x/eth'
import { Provider } from "decentraland-connect/dist/types"

export default function useEth(provider?: Provider | null) {
  return useMemo(() => provider ? new Eth(provider as any) : null, [ provider ])
}