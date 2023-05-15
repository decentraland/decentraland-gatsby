import React from 'react'

import useFormatMessage from '../../hooks/useFormatMessage'
import TokenList from '../../utils/dom/TokenList'

import './Live.css'

export type LiveProps = {
  primary?: boolean
  inverted?: boolean
}

export default function Live(props: LiveProps) {
  const l = useFormatMessage()
  return (
    <div
      className={TokenList.join([
        'Live',
        props.primary && 'primary',
        props.inverted && 'inverted',
      ])}
    >
      {l('components.badge.live')}
    </div>
  )
}
