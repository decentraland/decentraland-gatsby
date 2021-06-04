import { Eth } from 'web3x/eth'
import { HttpProvider, WebsocketProvider } from 'web3x/providers'
import { createItemPool } from '../Pool/utils'
import env from '../../utils/env'

const ETHEREUM_ENDPOINT = env('ETHEREUM_ENDPOINT', '')

export function fromEndpoint(endpoint: string) {
  const url = new URL(endpoint)
  switch (url.protocol) {
    case 'wss:':
      return new WebsocketProvider(endpoint)

    case 'https:':
      return new HttpProvider(endpoint)

    case null:
      return null

    default:
      throw new Error(`Invalid ethereum endpoint protocol: "${url.protocol}"`)
  }
}

export function getCurrentProviders() {
  return ETHEREUM_ENDPOINT.split(',')
    .map((endpoint) => fromEndpoint(endpoint))
    .filter(Boolean) as (WebsocketProvider | HttpProvider)[]
}

export function getEths() {
  return getCurrentProviders().map((provider) => new Eth(provider))
}

export function getEthPool() {
  const eth = getEths()
  if (eth.length === 0) {
    console.log(`creating empty pool`)
  }

  return createItemPool(eth)
}
