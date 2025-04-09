import React from 'react'

import {
  DownloadModal as BaseDownloadModal,
  DownloadModalProps,
} from 'decentraland-ui2/dist/components/Modal/DownloadModal'

import useFormatMessage from '../../hooks/useFormatMessage'

export default function DownloadModal(props: DownloadModalProps) {
  const { title, description, buttonLabel } = props
  const l = useFormatMessage()

  return (
    <BaseDownloadModal
      {...props}
      title={title || l(`@growth.DownloadModal.title`)}
      description={description || l(`@growth.DownloadModal.description`)}
      buttonLabel={buttonLabel || l(`@growth.DownloadModal.button_label`)}
    />
  )
}
