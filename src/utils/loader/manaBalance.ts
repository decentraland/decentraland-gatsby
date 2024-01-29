import { formatUnits } from '@ethersproject/units'
import { MANA_GRAPH_BY_CHAIN_ID } from 'decentraland-dapps/dist/lib/chainConfiguration'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import rollbar from '../development/rollbar'
import segment from '../development/segment'
import sentry from '../development/sentry'
import Loader from './Loader'

export type ChainId = keyof typeof MANA_GRAPH_BY_CHAIN_ID

const QUERY = `
query ($address: String!) {
  accounts(where: { id: $address }) {
    id,
    mana
  }
}
`

export async function fetchManaBalance(address: string, chainId: ChainId) {
  if (!isEthereumAddress(address)) {
    return 0
  }

  try {
    const response = await fetch(MANA_GRAPH_BY_CHAIN_ID[chainId], {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: QUERY,
        variables: { address: address.toLowerCase() },
      }),
    })

    const body = await response.json()
    const accounts = body?.data?.accounts || []
    const account = accounts[0]
    const mana = account?.mana || '0'
    return parseFloat(formatUnits(mana, 'ether'))
  } catch (err) {
    console.error(err)
    rollbar((rollbar) => rollbar.error(err))
    sentry((sentry) => sentry.captureException(err))
    segment((analytics) =>
      analytics.track('error', {
        ...err,
        message: err.message,
        stack: err.stack,
      })
    )
    return 0
  }
}

function createBalanceLoader(chainId: ChainId) {
  return new Loader(async (address: string) => {
    return fetchManaBalance(address, chainId)
  })
}

const cache = new Map<ChainId, Loader<number>>()

export default function manaBalance(chainId: ChainId): Loader<number> {
  if (!cache.has(chainId)) {
    cache.set(chainId, createBalanceLoader(chainId))
  }

  return cache.get(chainId)!
}
