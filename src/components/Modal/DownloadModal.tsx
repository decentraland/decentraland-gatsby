import React, { useCallback } from 'react'

import { DownloadButton } from 'decentraland-ui2/dist/components/DownloadButton'
import { Modal, ModalProps } from 'decentraland-ui2/dist/components/Modal'

import { emotionStyled as styled } from 'decentraland-ui2'

import Paragraph from '../../components/Text/Paragraph'
import useFormatMessage from '../../hooks/useFormatMessage'
import ExplorerJumpinImage from '../../images/explorer-jumpin-modal.svg'
import Title from '../Text/Title'

export type DownloadModalProps = Omit<ModalProps, 'children'> & {
  title?: string
  description?: string
  buttonLabel?: string
  onDownloadClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const StyledTitle = styled(Title)({
  '&.dg.Title': {
    fontSize: '21px',
    fontWeight: 600,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.43,
    letterSpacing: '0.3px',
    textAlign: 'center',
  },
})

const StyledDescription = styled(Paragraph)({
  '&.dg.Paragraph': {
    fontSize: '17px',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.53,
    letterSpacing: '-0.2px',
    textAlign: 'center',
  },
})

const Content = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
})

const ImageContainer = styled.div({
  '& img': {
    maxWidth: '100%',
    height: 'auto',
  },
})

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
