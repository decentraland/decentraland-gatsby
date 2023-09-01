import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'

import env from '../../utils/env'

const CHAIN_ID: ChainId[] = (
  env('CHAIN_ID') || env('DEFAULT_CHAIN_ID', String(ChainId.ETHEREUM_MAINNET))
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

export type AuthProviderProps = {
  // Url of the sso application (Eg: https://id.decentraland.org)
  sso?: string
}
