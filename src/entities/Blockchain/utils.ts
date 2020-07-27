
function getEndpointId(endpoint: string) {
  const url = new URL(endpoint)
  return url.pathname.split('/')[2]
}

function getNetworkId(endpoint: string) {
  const url = new URL(endpoint)
  const network = url.host.split('.')[0]
  switch (network) {
    case 'mainnet':
      return 1
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'goerli':
      return 5
    case 'kovan':
      return 42
    default:
      return undefined
  }
}
