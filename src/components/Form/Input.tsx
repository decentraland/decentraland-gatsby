import React from 'react'
import TokenList from '../../utils/TokenList'
import { StyleNamespace } from '../../variables'

import './Input.css'
import Paragraph from '../Text/Paragraph'

export type InputProps = Omit<React.HTMLProps<HTMLInputElement>, 'size'> & {
  error?: boolean,
  message?: React.ReactNode,
  verticalAlign?: 'top' | 'bottom' | 'middle',
  size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive'
}

export default function Input({ className, size, message, verticalAlign, error, ...props }: InputProps) {

  const msg = typeof message === 'string' ? <Paragraph secondary>{message}</Paragraph> : message

  return <div
    className={TokenList.join([
      StyleNamespace,
      'Input',
      props.disabled && `Input--disabled`,
      error && `Input--error`,
      size && `Input--${size}`,
      verticalAlign && `Input--align-${verticalAlign}`,
      className
    ])}>
    <input {...props} />
    <div className="Input__Message">{msg}</div>
  </div>
}