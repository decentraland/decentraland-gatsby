import React from 'react'

import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'

import './Italic.css'

export type ItalicProps = React.HTMLProps<HTMLSpanElement> & {
  primary?: boolean
  secondary?: boolean
}

export default React.memo(function Italic({
  primary,
  secondary,
  ...props
}: ItalicProps) {
  return (
    <span
      {...props}
      className={TokenList.join([
        StyleNamespace,
        'Italic',
        primary && 'Italic--primary',
        secondary && 'Italic--secondary',
        props.className,
      ])}
    />
  )
})
