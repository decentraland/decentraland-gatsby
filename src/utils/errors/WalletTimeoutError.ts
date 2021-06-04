export default class WalletTimeoutError extends Error {
  code = 'TIMEOUT_ERROR'
  constructor(message = 'Could not connect to Ethereum') {
    super(message)
  }
}
