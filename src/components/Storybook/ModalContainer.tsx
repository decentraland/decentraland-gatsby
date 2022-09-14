import React, { useEffect, useState } from 'react'

import IntlStorybookProvider from './IntlStorybookProvider'

import type { ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'

import './ModalContainer.css'

export type ModalContainerProps = ModalProps & {
  Modal?: React.JSXElementConstructor<ModalProps>
}

const uid = (() => {
  let id = 0
  return () => id++
})()

export default function ModalContainer({
  Modal,
  ...props
}: ModalContainerProps) {
  const [id] = useState(() => 'modal_container_' + uid())
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
