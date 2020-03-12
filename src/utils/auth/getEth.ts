import { Eth } from 'web3x/eth';
import isMobile from '../isMobile';
import WalletConnectError from '../errors/WalletConnectError';
let FIXED_PROVIDER = false;

export default function getEth() {
  if (!FIXED_PROVIDER) {
    // Hack for old providers and mobile providers which does not have a hack to convert send to sendAsync
    const provider = (window as any).ethereum;
    if (isMobile() && provider && typeof provider.sendAsync === 'function') {
      provider.send = provider.sendAsync;
    }
    FIXED_PROVIDER = true;
  }
  const eth = Eth.fromCurrentProvider();
  if (!eth) {
    // this could happen if metamask is not installed
    throw new WalletConnectError();
  }
  return eth;
}
