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
import './WalletSelectorModal.css'
import { ChainId } from '../../utils/loader/ensBalance'
import { getChainId } from '../../context/Auth/utils'

const enabledProviders = new Set([
  ProviderType.INJECTED,
  ProviderType.FORTMATIC,
  // ProviderType.NETWORK,
  ProviderType.WALLET_CONNECT,
])

export type WalletSelectorProps = {
  open?: boolean
  loading?: boolean
  error?: string | null
  availableProviders?: ProviderType[]
  onConnect?: (providerType: ProviderType, chainId: ChainId) => void
  onClose?: () => void
}

export default React.memo(function WalletSelector(props: WalletSelectorProps) {
  const [availableProviders, setAvailableProviders] = useState<
    (readonly [ProviderType, LoginModalOptionType])[] | null
  >(null)

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

  function handleConnect(providerType: ProviderType, chainId: ChainId) {
    if (props.onConnect) {
      props.onConnect(providerType, chainId)
    }
  }

  return (
    <LoginModal
      open={props.open}
      loading={props.loading}
      onClose={props.onClose}
    >
      {(availableProviders || []).map(([providerType, optionType]) => {
        switch (providerType) {
          case ProviderType.INJECTED:
            return (
              <LoginModal.Option
                key={providerType}
                type={optionType}
                onClick={() => handleConnect(providerType, getChainId())}
              />
            )
          case ProviderType.FORTMATIC:
            return (
              <LoginModal.Option
                key={providerType}
                type={optionType}
                onClick={() => handleConnect(providerType, getChainId())}
              />
            )
          case ProviderType.WALLET_CONNECT:
            return (
              <LoginModal.Option
                key={providerType}
                type={optionType}
                onClick={() => handleConnect(providerType, getChainId())}
              />
            )
          default:
            return null
        }
      })}
      <small className="message">
        Trezor and smart contract wallets (like Dapper or Argent) cannot interact Polygon.
        Read more about the Trezor support status <a href="https://github.com/trezor/trezor-firmware/pull/1568" target="_blank" rel="noopener noreferrer">here</a>
      </small>
      {props.error && <p className="error visible">{props.error}</p>}
    </LoginModal>
  )
})
