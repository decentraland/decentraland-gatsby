import React, { useCallback, useEffect, useState } from 'react'

import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { connection } from 'decentraland-connect/dist/ConnectionManager'
import { toModalOptionType } from 'decentraland-dapps/dist/containers/LoginModal/utils'
import {
  LoginModal,
  LoginModalOptionType,
} from 'decentraland-ui/dist/components/LoginModal/LoginModal'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'
import { ModalNavigation } from 'decentraland-ui/dist/components/ModalNavigation/ModalNavigation'
import ModalContent from 'semantic-ui-react/dist/commonjs/modules/Modal/ModalContent'

import { getChainId } from '../../context/Auth/utils'
import useAnchor from '../../hooks/useAnchor'
import useFormatMessage from '../../hooks/useFormatMessage'
import { ChainId } from '../../utils/loader/ensBalance'
import Loader from '../Progress/Loader'
// import Markdown from '../Text/Markdown'
import Link from '../Text/Link'
import Paragraph from '../Text/Paragraph'

import 'decentraland-ui/dist/components/LoginModal/LoginModal.css'
import './WalletSelectorModal.css'

export type WalletSelectorProps = {
  open?: boolean
  loading?: boolean
  providerType?: ProviderType
  error?: string | null
  availableProviders?: ProviderType[]
  disabledWalletConnect2?: boolean
  mountNode?: any
  onConnect?: (providerType: ProviderType, chainId: ChainId) => void
  onClose?: () => void
}

export { LoginModalOptionType }

export default React.memo(function WalletSelector(props: WalletSelectorProps) {
  const l = useFormatMessage()
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
    () =>
      handleConnect(
        props.disabledWalletConnect2
          ? ProviderType.WALLET_CONNECT
          : ProviderType.WALLET_CONNECT_V2,
        getChainId()
      ),
    [handleConnect, props.disabledWalletConnect2]
  )
  const handleConnectWalletLink = useCallback(
    () => handleConnect(ProviderType.WALLET_LINK, getChainId()),
    [handleConnect]
  )

  return (
    <Modal
      open={props.open}
      className={`dcl login-modal`}
      mountNode={props.mountNode}
    >
      <ModalNavigation
        title={l('@growth.WalletSelector.title')}
        subtitle={l('@growth.WalletSelector.subtitle')}
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
        {availableProviders.has(ProviderType.WALLET_LINK) && (
          <LoginModal.Option
            type={LoginModalOptionType.WALLET_LINK}
            onClick={handleConnectWalletLink}
          />
        )}
        <small className="message">
          <Paragraph>
            {l('@growth.WalletSelector.trezor_message', {
              here: (
                <Link href={l('@growth.WalletSelector.trezor_target')}>
                  {l('@growth.WalletSelector.trezor_cta')}
                </Link>
              ),
            })}
          </Paragraph>
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
})
