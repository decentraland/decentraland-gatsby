import { ChainId } from '@dcl/schemas'

const DEFAULT_CHAIN_ID: ChainId = Number(
  process.env.GATSBY_DEFAULT_CHAIN_ID ||
  process.env.DEFAULT_CHAIN_ID ||
  String(ChainId.MATIC_MAINNET)
)

const SUPPORTED_CHAIN_IDS: Set<ChainId> = new Set((
  process.env.GATBY_SUPPORTED_CHAIN_ID ||
  process.env.SUPPORTED_CHAIN_ID ||
  Object.values(ChainId).filter(chainId => Number.isFinite(chainId)).join(',')
)
  .split(',')
  .map(n => Number(n))
)

export function getDefaultChainId(): ChainId {
  return DEFAULT_CHAIN_ID
}

export function getCurrentChainId(): ChainId {
  if (typeof window !== 'undefined' && window.ethereum) {
    const injectedChainId = Number((window.ethereum as any).chainId)
    if (injectedChainId && SUPPORTED_CHAIN_IDS.has(injectedChainId)) {
      return injectedChainId
    }
  }

  return DEFAULT_CHAIN_ID
}