import { Address } from 'web3x/address';
import EmptyAccountsError from '../errors/EmptyAccountsError';
import WalletConnectError from '../errors/WalletConnectError';
import getProvider from './getProvider';

export default async function getCurrentAddress() {
  const provider = await getProvider()
  if (!provider) {
    // this could happen if metamask is not installed
    throw new WalletConnectError();
  }

  let accounts: string[] = []
  if (provider.enable) {
    accounts = await provider.enable()
  }

  if (accounts.length === 0) {
    accounts = await provider.send('eth_requestAccounts')
  }

  if (accounts.length === 0) {
    // This could happen if metamask was not enabled
    throw new EmptyAccountsError();
  }

  return Address.fromString(accounts[0].toString());
}
