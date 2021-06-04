import React from 'react'
import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'
import './Paragraph.css'

export type ParagraphProps = React.Props<HTMLParagraphElement> &
  React.HTMLProps<HTMLParagraphElement> & {
    primary?: boolean
    secondary?: boolean
    small?: boolean
    tiny?: boolean
    italic?: boolean
    bold?: boolean
    semiBold?: boolean
    underline?: boolean
    uppercase?: boolean
  }

export default React.memo(function Paragraph({
  primary,
  secondary,
  small,
  tiny,
  bold,
  semiBold,
  italic,
  underline,
  uppercase,
  ...props
}: ParagraphProps) {
  return (
    <p
      {...props}
      className={TokenList.join([
        StyleNamespace,
        'Paragraph',
        primary && 'Paragraph--primary',
        secondary && 'Paragraph--secondary',
        bold && 'Paragraph--bold',
        semiBold && 'Paragraph--semi-bold',
        italic && 'Paragraph--italic',
        underline && 'Paragraph--underline',
        small && 'Paragraph--small',
        tiny && 'Paragraph--tiny',
        uppercase && 'Paragraph--uppercase',
        props.className,
      ])}
    />
  )
})
