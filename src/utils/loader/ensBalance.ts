import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import segment from '../development/segment'
import sentry from '../development/sentry'
import 'isomorphic-fetch'

const DECENTRALAND_MARKETPLACE_SUBGRAPH_URL: Partial<Record<ChainId, string>> =
  {
    [ChainId.ETHEREUM_MAINNET]:
      'https://api.thegraph.com/subgraphs/name/decentraland/marketplace',
    [ChainId.ETHEREUM_ROPSTEN]:
      'https://api.thegraph.com/subgraphs/name/decentraland/marketplaceropsten',
    [ChainId.ETHEREUM_SEPOLIA]:
      'https://api.studio.thegraph.com/query/49472/marketplace-sepolia/version/latest',
  }

const QUERY = `
query ($address: String!, $first: Int!, $skip: Int!) {
  nfts(where: { owner: $address, category: ens }, first: $first, skip: $skip) {
    tokenId
  }
}
`

export { ChainId }

export async function fetchEnsBalance(address: string, chainId: ChainId) {
  if (!isEthereumAddress(address)) {
    return 0
  }

  const target = DECENTRALAND_MARKETPLACE_SUBGRAPH_URL[chainId]
  if (!target) {
    return 0
  }

  try {
    let skip = 0
    let lands = 0
    let hasNext = true
    const first = 1000
    while (hasNext) {
      const response = await fetch(target, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: QUERY,
          variables: { address: address.toLowerCase(), first, skip },
        }),
      })

      const body = await response.json()
      const nfts = (body?.data?.nfts || []) as {}[]
      lands += nfts.length
      skip += first
      hasNext = nfts.length === first
    }

    return lands
  } catch (err) {
    console.error(err)
    sentry((tracker) => tracker.error(err))
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
