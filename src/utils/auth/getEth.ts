import { Eth } from 'web3x/eth';
import WalletConnectError from '../errors/WalletConnectError';
import getProvider from './getProvider';

export default async function getEth() {
  await getProvider()
  const eth = Eth.fromCurrentProvider();
  if (!eth) {
    // this could happen if metamask is not installed
    throw new WalletConnectError();
  }
  return eth;
}
