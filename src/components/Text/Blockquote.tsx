import React from 'react'
import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'

import './Blockquote.css'

export type BlockquoteProps = React.HTMLAttributes<HTMLQuoteElement>

export default function Blockquote(props: BlockquoteProps) {
  return (
    <blockquote
      {...props}
      className={TokenList.join([
        StyleNamespace,
        'Blockquote',
        props.className,
      ])}
    />
  )
}
