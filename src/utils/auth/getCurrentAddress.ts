import { Address } from 'web3x/address';
import EmptyAccountsError from '../errors/EmptyAccountsError';
import getEth from './getEth';
export default async function getCurrentAddress() {
  let accounts: Address[] = await getEth().getAccounts();
  if (accounts.length === 0) {
    // This could happen if metamask was not enabled
    throw new EmptyAccountsError();
  }
  return accounts[0];
}
