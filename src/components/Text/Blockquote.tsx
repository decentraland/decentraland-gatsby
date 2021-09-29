import React from 'react'
import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'

import './Blockquote.css'

export type BlockquoteProps = React.HTMLAttributes<HTMLQuoteElement> & {
  primary?: boolean
  danger?: boolean
  error?: boolean
}

export default React.memo(function Blockquote({
  primary,
  danger,
  error,
  ...props
}: BlockquoteProps) {
  return (
    <blockquote
      {...props}
      className={TokenList.join([
        StyleNamespace,
        'Blockquote',
        primary && 'Blockquote--primary',
        danger && 'Blockquote--danger',
        error && 'Blockquote--error',
        props.className,
      ])}
    />
  )
})
