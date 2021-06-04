import { ChainId } from '@dcl/schemas'

const CHAIN_ID: ChainId = Number(
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

export function getDefaultChainId(): ChainId {
  return CHAIN_ID
}

export function getChainId(): ChainId {
  return CHAIN_ID
}
