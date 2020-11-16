import { Eth } from 'web3x/eth';
import WalletConnectError from '../errors/WalletConnectError';
import getProvider from './getProvider';

export default async function getEth() {
  const provider = getProvider()

  if (!provider) {
    // this could happen if metamask is not installed
    throw new WalletConnectError();
  }

  return new Eth(provider)
}
