import fetch from 'isomorphic-fetch'
import { ChainId } from '@dcl/schemas'
import { MANA_GRAPH_BY_CHAIN_ID } from 'decentraland-dapps/dist/lib/chainConfiguration'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

const DECENTRALAND_MARKETPLACE_SUBGRAPH_URL = {
  [ChainId.ETHEREUM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/decentraland/marketplace',
  [ChainId.ETHEREUM_ROPSTEN]: 'https://api.thegraph.com/subgraphs/name/decentraland/marketplaceropsten'
};

const QUERY = `
query ($address: String!, $first: Number!, $skip: Number!) {
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
    while(hasNext) {
      const response = await fetch(MANA_GRAPH_BY_CHAIN_ID[chainId], {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: QUERY,
          variables: { address: address.toLowerCase(), first, skip }
        })
      })

      const body = await response.json()
      const nfts = (body?.data?.nfts || []) as {}[]
      lands += nfts.length
      skip += first
      hasNext = nfts.length === first
    }

    return lands
  }  catch (err) {
    console.error(err)
    return 0
  }
}
