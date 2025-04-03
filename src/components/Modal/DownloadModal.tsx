import React, { useCallback } from 'react'

import { Modal, ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'
import { DownloadButton } from 'decentraland-ui2/dist/components/DownloadButton/DownloadButton'

import Paragraph from '../../components/Text/Paragraph'
import Title from '../../components/Text/Title'
import useFormatMessage from '../../hooks/useFormatMessage'
import ExplorerJumpinImage from '../../images/explorer-jumpin-modal.svg'
import closeIcon from '../../images/popup-close.svg'
import TokenList from '../../utils/dom/TokenList'

import './DownloadModal.css'

export type DownloadModalProps = Omit<ModalProps, 'children'> & {
  title?: string
  description?: string
  buttonLabel?: string
  onDownloadClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function DownloadModal(props: DownloadModalProps) {
  const { title, description, buttonLabel, onClose, onDownloadClick } = props
  const l = useFormatMessage()

  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (onClose) {
        onClose(event, props)
      }
    },
    [onClose, props]
  )

  return (
    <Modal
      {...props}
      className={TokenList.join(['download-modal', props.className])}
    >
      <div className="download-modal__close" onClick={handleClose}>
        <img src={closeIcon} width="14" height="14" />
      </div>

      <div>
        <img src={ExplorerJumpinImage} alt="Explorer Jump In" />
      </div>
      <Title>{title || l(`@growth.DownloadModal.title`)}</Title>
      <Paragraph>
        {description || l(`@growth.DownloadModal.description`)}
      </Paragraph>
      <DownloadButton
        label={buttonLabel || l(`@growth.DownloadModal.button_label`)}
        onClick={onDownloadClick}
      />
    </Modal>
  )
}
