import React, { useCallback, useEffect, useState } from 'react'
import ModalContent from 'semantic-ui-react/dist/commonjs/modules/Modal/ModalContent'
import {
  LoginModal,
  LoginModalOptionType,
} from 'decentraland-ui/dist/components/LoginModal/LoginModal'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'
import { ModalNavigation } from 'decentraland-ui/dist/components/ModalNavigation/ModalNavigation'
import { toModalOptionType } from 'decentraland-dapps/dist/containers/LoginModal/utils'
import { connection } from 'decentraland-connect/dist/ConnectionManager'
import { ProviderType } from 'decentraland-connect/dist/types'
import { ChainId } from '../../utils/loader/ensBalance'
import { getChainId } from '../../context/Auth/utils'
import useAnchor from '../../hooks/useAnchor'
import Loader from '../Progress/Loader'
import 'decentraland-ui/dist/components/LoginModal/LoginModal.css'
import './WalletSelectorModal.css'

export type WalletSelectorProps = {
  open?: boolean
  loading?: boolean
  providerType?: ProviderType
  error?: string | null
  availableProviders?: ProviderType[]
  mountNode?: any
  onConnect?: (providerType: ProviderType, chainId: ChainId) => void
  onClose?: () => void
}

export { LoginModalOptionType }

const i18n = {
  title: 'Sign In',
  subtitle: 'Choose a method to connect',
}

export default React.memo(function WalletSelector(props: WalletSelectorProps) {
  const [provider, setProvider] = useState(LoginModalOptionType.METAMASK)
  const [availableProviders, setAvailableProviders] = useState(
    new Set<ProviderType>([])
  )

  // Detect available providers
  useEffect(
    () =>
      setAvailableProviders(
        new Set(props.availableProviders ?? connection.getAvailableProviders())
      ),
    [...(props.availableProviders || [])]
  )

  useEffect(() => {
    setProvider(
      toModalOptionType(ProviderType.INJECTED) || LoginModalOptionType.METAMASK
    )
  }, [])

  const handleConnect = useCallback(
    (providerType: ProviderType, chainId: ChainId) => {
      if (props.onConnect) {
        props.onConnect(providerType, chainId)
      }
    },
    [props.onClose]
  )

  const open = useAnchor('https://metamask.io/download.html')
  const handleConnectInjected = useCallback(() => {
    if (availableProviders.has(ProviderType.INJECTED)) {
      handleConnect(ProviderType.INJECTED, getChainId())
    } else {
      open()
    }
  }, [handleConnect, open, availableProviders])
  const handleConnectFortmatic = useCallback(
    () => handleConnect(ProviderType.FORTMATIC, getChainId()),
    [handleConnect]
  )
  const handleConnectWalletConnect = useCallback(
    () => handleConnect(ProviderType.WALLET_CONNECT, getChainId()),
    [handleConnect]
  )

  return (
    <Modal
      open={props.open}
      className={`dcl login-modal`}
      mountNode={props.mountNode}
    >
      <ModalNavigation
        title={i18n.title}
        subtitle={i18n.subtitle}
        onClose={props.onClose}
      />
      <ModalContent>
        <LoginModal.Option type={provider} onClick={handleConnectInjected} />
        {availableProviders.has(ProviderType.FORTMATIC) && (
          <LoginModal.Option
            type={LoginModalOptionType.FORTMATIC}
            onClick={handleConnectFortmatic}
          />
        )}
        {availableProviders.has(ProviderType.WALLET_CONNECT) && (
          <LoginModal.Option
            type={LoginModalOptionType.WALLET_CONNECT}
            onClick={handleConnectWalletConnect}
          />
        )}
        <small className="message">
          Trezor and smart contract wallets (like Dapper or Argent) cannot
          interact Polygon. Read more about the Trezor support status{' '}
          <a
            href="https://github.com/trezor/trezor-firmware/pull/1568"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
        </small>
      </ModalContent>
      {props.error && <p className="error visible">{props.error}</p>}
      {props.loading ? (
        <>
          <Loader size="big" active provider={props.providerType} />
          <div className="loader-background"></div>
        </>
      ) : null}
    </Modal>
  )

  // return (
  //   <LoginModal
  //     open={props.open}
  //     loading={props.loading}
  //     onClose={props.onClose}
  //     mountNode={props.mountNode}
  //   >
  //     <LoginModal.Option type={toModalOptionType(ProviderType.INJECTED)!} onClick={handleConnectInjected} />
  //     {availableProviders.has(ProviderType.FORTMATIC) && <LoginModal.Option type={toModalOptionType(ProviderType.FORTMATIC)!} onClick={handleConnectFortmatic} />}
  //     {availableProviders.has(ProviderType.WALLET_CONNECT) && <LoginModal.Option type={toModalOptionType(ProviderType.WALLET_CONNECT)!} onClick={handleConnectWalletConnect} />}
  //     <small className="message">
  //       Trezor and smart contract wallets (like Dapper or Argent) cannot
  //       interact Polygon. Read more about the Trezor support status{' '}
  //       <a
  //         href="https://github.com/trezor/trezor-firmware/pull/1568"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         here
  //       </a>
  //     </small>
  //     {props.error && <p className="error visible">{props.error}</p>}
  //   </LoginModal>
  // )
})
