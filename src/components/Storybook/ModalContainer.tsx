import React, { useEffect, useState } from 'react'

import { uid } from 'radash/dist/random'

import IntlStorybookProvider from './IntlStorybookProvider'

import type { ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'

import './ModalContainer.css'

export type ModalContainerProps = ModalProps & {
  Modal?: React.JSXElementConstructor<ModalProps>
}

export default function ModalContainer({
  Modal,
  ...props
}: ModalContainerProps) {
  const [id] = useState(() => 'id_' + uid(6))
  const [mountNode, setMountNode] = useState<HTMLElement | null>()
  useEffect(() => setMountNode(document.getElementById(id)), [id])
  return (
    <IntlStorybookProvider>
      <div>
        <div id={id} />
        {Modal && mountNode && <Modal {...props} mountNode={mountNode} />}
      </div>
    </IntlStorybookProvider>
  )
}
