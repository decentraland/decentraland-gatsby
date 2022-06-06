import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import rollbar from '../development/rollbar'
import segment from '../development/segment'
import 'isomorphic-fetch'

const DECENTRALAND_MARKETPLACE_SUBGRAPH_URL = {
  [ChainId.ETHEREUM_MAINNET]:
    'https://api.thegraph.com/subgraphs/name/decentraland/marketplace',
  [ChainId.ETHEREUM_ROPSTEN]:
    'https://api.thegraph.com/subgraphs/name/decentraland/marketplaceropsten',
}

const QUERY = `
query ($address: String!, $first: Int!, $skip: Int!) {
  nfts(where: { owner: $address, category: parcel }, first: $first, skip: $skip) {
    tokenId
  }
}
`

export { ChainId }

export async function fetchLandBalance(address: string, chainId: ChainId) {
  if (!isEthereumAddress(address)) {
    return 0
  }

  if (!DECENTRALAND_MARKETPLACE_SUBGRAPH_URL[chainId]) {
    return 0
  }

  try {
    let skip = 0
    let lands = 0
    let hasNext = true
    const first = 1000
    while (hasNext) {
      const response = await fetch(
        DECENTRALAND_MARKETPLACE_SUBGRAPH_URL[chainId],
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: QUERY,
            variables: { address: address.toLowerCase(), first, skip },
          }),
        }
      )

      const body = await response.json()
      const nfts = (body?.data?.nfts || []) as {}[]
      lands += nfts.length
      skip += first
      hasNext = nfts.length === first
    }

    return lands
  } catch (err) {
    console.error(err)
    rollbar((rollbar) => rollbar.error(err))
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
