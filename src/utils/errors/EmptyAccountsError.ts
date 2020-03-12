export default class EmptyAccountsError extends Error {
  code = 'EMPTY_ACCOUNTS_ERROR'
  constructor(message = 'Could not get address') {
    super(message)
  }
}