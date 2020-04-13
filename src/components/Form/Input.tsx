import React from 'react'
import TokenList from '../../utils/TokenList'
import { StyleNamespace } from '../../variables'

import './Input.css'

export type InputProps = Omit<React.HTMLProps<HTMLInputElement>, 'size'> & {
  size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive'
}

export default function Input({ className, size, ...props }: InputProps) {
  return <input
    {...props}
    className={TokenList.join([
      StyleNamespace,
      'Input',
      props.disabled && `Input--disabled`,
      size && `Input--${size}`,
      className
    ])}
  />
}