import React, { useEffect, useState } from 'react'
import {
  LoginModal,
  LoginModalOptionType,
} from 'decentraland-ui/dist/components/LoginModal/LoginModal'
import {
  isCucumberProvider,
  isDapperProvider,
} from 'decentraland-dapps/dist/lib/eth'
import { connection } from 'decentraland-connect/dist/ConnectionManager'
import { ProviderType } from 'decentraland-connect/dist/types'
import useAuthContext from '../../context/Auth/useAuthContext'
import useChainId from '../../hooks/useChainId'
import './WalletSelectorModal.css'

const enabledProviders = new Set([
  ProviderType.INJECTED,
  ProviderType.FORTMATIC,
  // ProviderType.NETWORK,
  // ProviderType.WALLET_CONNECT,
])

export type WalletSelectorProps = {
  open?: boolean
  loading?: boolean
  availableProviders?: ProviderType[]
}

export default React.memo(function WalletSelector(props: WalletSelectorProps) {
  const [availableProviders, setAvailableProviders] = useState<
    (readonly [ProviderType, LoginModalOptionType])[] | null
  >(null)
  const [auth, state] = useAuthContext()
  const chainId = useChainId()

  // Detect available providers
  useEffect(() => {
    const providerTypes = (
      props.availableProviders ??
      (connection.getAvailableProviders()
        .filter((providerType) => enabledProviders.has(providerType)))
    )

    const providers = providerTypes.map((providerType) => {
      switch (providerType) {
        case ProviderType.INJECTED:
          if (isCucumberProvider()) {
            return [providerType, LoginModalOptionType.SAMSUNG] as const
          } else if (isDapperProvider()) {
            return [providerType, LoginModalOptionType.DAPPER] as const
          } else {
            return [providerType, LoginModalOptionType.METAMASK] as const
          }
        case ProviderType.NETWORK:
          return [providerType, LoginModalOptionType.METAMASK] as const
        case ProviderType.WALLET_CONNECT:
          return [
            providerType,
            LoginModalOptionType.WALLET_CONNECT,
          ] as const
        case ProviderType.FORTMATIC:
          return [providerType, LoginModalOptionType.FORTMATIC] as const
      }
    })!

    setAvailableProviders(providers)
  }, [])

  return (
    <LoginModal
      open={props.open ?? (!auth && state.selecting)}
      loading={props.loading ?? (availableProviders === null || state.loading)}
      onClose={() => state.select(false)}
    >
      {(availableProviders || []).map(([providerType, optionType]) => {
        switch (providerType) {
          case ProviderType.INJECTED:
            return (
              <LoginModal.Option
                key={providerType}
                type={optionType}
                onClick={() => state.connect(providerType, chainId)}
              />
            )
          case ProviderType.FORTMATIC:
            return (
              <LoginModal.Option
                key={providerType}
                type={optionType}
                onClick={() => state.connect(providerType, chainId)}
              />
            )
          case ProviderType.WALLET_CONNECT:
            return (
              <LoginModal.Option
                key={providerType}
                type={optionType}
                onClick={() => state.connect(providerType, chainId)}
              />
            )
          default:
            return null
        }
      })}
    </LoginModal>
  )
})
