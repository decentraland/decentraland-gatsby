import React, { useCallback, useEffect, useState } from 'react'

import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Header } from 'decentraland-ui/dist/components/Header/Header'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media/Media'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'

import useFormatMessage from '../../hooks/useFormatMessage'
import TokenList from '../../utils/dom/TokenList'

import './FilterContainerModal.css'

export type FilterContainerBaseModalProps = {
  className?: string
}

export type FilterContainerModalProps = FilterContainerBaseModalProps &
  FilterContainerMobileModalProps & {
    action?: React.ReactNode
    modal?: boolean
  }

export default React.memo(function FilterContainerModal({
  action,
  modal,
  ...props
}: FilterContainerModalProps) {
  const l = useFormatMessage()
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])
  const mobile = useMobileMediaQuery()
  const asModal = modal ?? mobile
  useEffect(() => {
    if (!mobile) {
      setOpen(false)
    }
  }, [mobile])

  return (
    <div className={TokenList.join(['filter-container', props.className])}>
      {!asModal && props.children}
      {asModal && (
        <Button
          className="filter-container__button"
          secondary
          onClick={handleOpen}
        >
          {action || l('@growth.WalletSelector.action')}
        </Button>
      )}
      {asModal && (
        <FilterContainerMobileModal
          {...props}
          open={open}
          onClose={handleClose}
        >
          {props.children}
        </FilterContainerMobileModal>
      )}
    </div>
  )
})

export type FilterContainerMobileModalProps = FilterContainerBaseModalProps & {
  open?: boolean
  title?: React.ReactNode
  onClose?: (event: React.SyntheticEvent<any>) => void
  onClear?: (event: React.SyntheticEvent<any>) => void
  children?: React.ReactNode
}

export const FilterContainerMobileModal = React.memo(
  function FilterContainerMobileModal({
    children,
    onClear,
    title,
    ...props
  }: FilterContainerMobileModalProps) {
    const l = useFormatMessage()
    return (
      <Modal {...props} className={TokenList.join(['filter-container__modal'])}>
        <Modal.Header>
          {!title && <Header>{l('@growth.WalletSelector.title')}</Header>}
          {!!title && typeof title === 'string' && <Header>{title}</Header>}
          {!!title && typeof title !== 'string' && title}
          <Button icon onClick={props.onClose}>
            <Icon name="close" />
          </Button>
        </Modal.Header>
        <Modal.Content>{children}</Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={onClear}>
            {l('@growth.WalletSelector.clear')}
          </Button>
          <Button primary onClick={props.onClose}>
            {l('@growth.WalletSelector.done')}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
)
