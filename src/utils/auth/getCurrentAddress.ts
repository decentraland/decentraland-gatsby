import { Address } from 'web3x/address';
import EmptyAccountsError from '../errors/EmptyAccountsError';
import getProvider from './getProvider';

export default async function getCurrentAddress() {
  const provider = await getProvider()
  let accounts: Address[] = await provider.enabled();
  if (accounts.length === 0) {
    // This could happen if metamask was not enabled
    throw new EmptyAccountsError();
  }
  return accounts[0];
}
