import { LegacyProviderAdapter, LegacyProvider } from 'web3x/providers';

export type Provider = LegacyProviderAdapter & { enable?: () => Promise<string[]> }

export default function getProvider() {
  const { ethereum } = window as Window & { ethereum?: LegacyProvider }
  return ethereum && (new LegacyProviderAdapter(ethereum) as Provider)
}