import React, { useCallback } from 'react'

import { DownloadButton } from 'decentraland-ui2/dist/components/DownloadButton'
import { Modal, ModalProps } from 'decentraland-ui2/dist/components/Modal'

import useFormatMessage from '../../hooks/useFormatMessage'
import ExplorerJumpinImage from '../../images/explorer-jumpin-modal.svg'
import {
  Content,
  ImageContainer,
  StyledDescription,
  StyledTitle,
} from './DownloadModal.styled'

export type DownloadModalProps = Omit<ModalProps, 'children'> & {
  title?: string
  description?: string
  buttonLabel?: string
  onDownloadClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function DownloadModal(props: DownloadModalProps) {
  const {
    title,
    description,
    buttonLabel,
    open,
    onClose,
    onDownloadClick,
    ...modalProps
  } = props
  const l = useFormatMessage()

  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onClose) {
        onClose(event)
      }
    },
    [onClose]
  )

  return (
    <Modal
      {...modalProps}
      open={open}
      size="tiny"
      title=" " // this is to move the close button to the right
      onClose={handleClose}
    >
      <Content>
        <ImageContainer>
          <img src={ExplorerJumpinImage} alt="Explorer Jump In" />
        </ImageContainer>
        <StyledTitle>{title || l(`@growth.DownloadModal.title`)}</StyledTitle>
        <StyledDescription>
          {description || l(`@growth.DownloadModal.description`)}
        </StyledDescription>
        <DownloadButton
          label={buttonLabel || l(`@growth.DownloadModal.button_label`)}
          onClick={onDownloadClick}
        />
      </Content>
    </Modal>
  )
}
