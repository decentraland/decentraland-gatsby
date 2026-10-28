import React from 'react'

import {
  DownloadModal as BaseDownloadModal,
  DownloadModalProps,
} from 'decentraland-ui2/dist/components/Modal/DownloadModal'

import useFormatMessage from '../../hooks/useFormatMessage'

export default function DownloadModal(props: DownloadModalProps) {
  const { i18n, ...modalProps } = props
  const l = useFormatMessage()

  return (
    <BaseDownloadModal
      {...modalProps}
      i18n={{
        title: l(`@growth.DownloadModal.title`),
        download: l(`@growth.DownloadModal.button_label`),
        ...i18n,
      }}
    />
  )
}
