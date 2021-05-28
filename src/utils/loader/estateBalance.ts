import fetch from 'isomorphic-fetch'
import { ChainId } from '@dcl/schemas'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

const DECENTRALAND_MARKETPLACE_SUBGRAPH_URL = {
  [ChainId.ETHEREUM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/decentraland/marketplace',
  [ChainId.ETHEREUM_ROPSTEN]: 'https://api.thegraph.com/subgraphs/name/decentraland/marketplaceropsten'
};

const QUERY = `
query ($address: String!, $first: Int!, $skip: Int!) {
  nfts(where: { owner: $address, category: estate, searchEstateSize_gt: 0 }, first: $first, skip: $skip) {
    searchEstateSize
  }
}
`

export { ChainId }

export async function fetchEstateBalance(address: string, chainId: ChainId) {
  if (!isEthereumAddress(address)) {
    return [0, 0] as const
  }

  if (!DECENTRALAND_MARKETPLACE_SUBGRAPH_URL[chainId]) {
    return [0, 0] as const
  }

  try {
    let skip = 0
    let estates = 0
    let lands = 0
    let hasNext = true
    const first = 1000
    while(hasNext) {
      const response = await fetch(DECENTRALAND_MARKETPLACE_SUBGRAPH_URL[chainId], {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: QUERY,
          variables: { address: address.toLowerCase(), first, skip }
        })
      })

      const body = await response.json()
      const nfts = (body?.data?.nfts || []) as { searchEstateSize: number }[]
      estates += nfts.length
      lands += nfts.reduce((total, nft) => total + nft.searchEstateSize, 0)
      skip += first
      hasNext = nfts.length === first
    }

    return [ estates, lands ] as const
  }  catch (err) {
    console.error(err)
    return [0, 0] as const
  }
}
