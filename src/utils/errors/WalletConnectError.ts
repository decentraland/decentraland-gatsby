export default class WalletConnectError extends Error {
  code = 'CONNECT_ERROR'
  constructor(message = 'Could not connect to Ethereum') {
    super(message)
  }
}