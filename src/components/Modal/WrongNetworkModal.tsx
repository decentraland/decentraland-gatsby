import React, { useMemo } from 'react'
import { ChainId, getChainName } from '@dcl/schemas'
import { ProviderType } from 'decentraland-connect/dist/types'
import { Modal, ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { ModalNavigation } from 'decentraland-ui/dist/components/ModalNavigation/ModalNavigation'
import useLocalFormatMessage from '../../hooks/useLocalFormatMessage'

const defaultI18n = {
  header: 'Wrong Network',
  message:
    'You need to be connected to {expectedChainName} to use this app, but you are currently connected to {currentChainName}.',
  change_chain: 'switch to {expectedChainName}',
  separator: ' or ',
  unknown_chain: 'Unknown',
}

export type WrongNetworkModalProps = ModalProps & {
  currentNetwork?: ChainId | null
  expectedNetwork?: ChainId | ChainId[]
  providerType?: ProviderType | null
  i18n?: Partial<typeof defaultI18n>
  onSwitchNetwork?: (chainId: ChainId) => void
}

const anyNetwork = [
  ChainId.ETHEREUM_GOERLI,
  ChainId.ETHEREUM_KOVAN,
  ChainId.ETHEREUM_MAINNET,
  ChainId.ETHEREUM_RINKEBY,
  ChainId.ETHEREUM_ROPSTEN,
  ChainId.MATIC_MAINNET,
  ChainId.MATIC_MUMBAI,
]

export default React.memo(function WrongNetworkModal({
  open,
  currentNetwork,
  expectedNetwork,
  onSwitchNetwork,
  providerType,
  i18n,
  ...props
}: WrongNetworkModalProps) {
  const l = useLocalFormatMessage(i18n, defaultI18n, 'WrongNetworkModal')
  const expectedNetworks = useMemo(() => {
    if (!expectedNetwork) {
      return anyNetwork
    }

    if (Array.isArray(expectedNetwork)) {
      return expectedNetwork
    }

    return [expectedNetwork]
  }, [expectedNetwork])

  const isOpen = useMemo(
    () =>
      open ?? (!!currentNetwork && !expectedNetworks.includes(currentNetwork)),
    [open, currentNetwork, expectedNetworks]
  )

  const expectedChainName = useMemo(() => {
    switch (expectedNetworks.length) {
      case 0:
        return <b />
      case 1:
        return <b>{getChainName(expectedNetworks[0])}</b>
      default:
        return (
          <span>
            {expectedNetworks.map((chainId, i, list) => (
              <span key={chainId}>
                <b>{getChainName(chainId)}</b>
                {i === list.length - 1
                  ? ', '
                  : l('@growth.WrongNetworkModal.separator')}
              </span>
            ))}
          </span>
        )
    }
  }, [expectedNetworks])

  const currentChainName = useMemo(
    () => (
      <b>
        {currentNetwork
          ? getChainName(currentNetwork)
          : l('@growth.WrongNetworkModal.unknown_chain')}
      </b>
    ),
    [currentNetwork]
  )

  const allowNetworkSwitch = useMemo(
    () => providerType === ProviderType.INJECTED,
    [providerType]
  )

  return (
    <Modal
      size="tiny"
      {...props}
      open={isOpen}
      style={{ position: 'absolute' }}
    >
      <ModalNavigation title={l('@growth.WrongNetworkModal.header')} />
      <Modal.Content>
        {l('@growth.WrongNetworkModal.message', {
          currentChainName,
          expectedChainName,
        })}
      </Modal.Content>
      {allowNetworkSwitch && expectedNetworks.length > 0 && (
        <Modal.Content>
          {expectedNetworks.map((chainId: ChainId, index: number) => {
            return (
              <Button
                fluid
                key={chainId}
                basic={index !== 0}
                primary={index === 0}
                style={index === 0 ? {} : { marginTop: '1em' }}
                onClick={() => onSwitchNetwork && onSwitchNetwork(chainId)}
              >
                {l('@growth.WrongNetworkModal.change_chain', {
                  expectedChainName: <b>{getChainName(chainId)}</b>,
                })}
              </Button>
            )
          })}
        </Modal.Content>
      )}
    </Modal>
  )
})
