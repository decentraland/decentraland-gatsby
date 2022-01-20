import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'

const CHAIN_ID: ChainId[] = String(
  process.env.GATSBY_CHAIN_ID ||
    process.env.REACT_APP_CHAIN_ID ||
    process.env.STORYBOOK_CHAIN_ID ||
    process.env.CHAIN_ID ||
    process.env.GATSBY_DEFAULT_CHAIN_ID ||
    process.env.REACT_APP_DEFAULT_CHAIN_ID ||
    process.env.STORYBOOK_DEFAULT_CHAIN_ID ||
    process.env.DEFAULT_CHAIN_ID ||
    String(ChainId.ETHEREUM_MAINNET)
)
  .split(',')
  .filter(Boolean)
  .map((chainId) => Number(chainId))

export function getSupportedChainIds(): ChainId[] {
  return CHAIN_ID
}

export function getDefaultChainId(): ChainId {
  return CHAIN_ID[0]
}

export function getChainId(): ChainId {
  return CHAIN_ID[0]
}
