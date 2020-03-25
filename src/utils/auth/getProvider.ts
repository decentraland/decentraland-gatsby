import isMobile from '../isMobile';
let FIXED_PROVIDER = false;

export default async function getProvider() {
  const provider = (window as any).ethereum;
  if (!FIXED_PROVIDER) {
    // Hack for old providers and mobile providers which does not have a hack to convert send to sendAsync
    if (isMobile() && provider && typeof provider.sendAsync === 'function') {
      provider.send = provider.sendAsync;
    }
    FIXED_PROVIDER = true;
  }

  return provider
}