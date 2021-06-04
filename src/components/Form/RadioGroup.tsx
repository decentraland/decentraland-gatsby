import React from 'react'
import TokenList from '../../utils/dom/TokenList'
import { FieldProps } from 'decentraland-ui/dist/components/Field/Field'
import './RadioGroup.css'

export type RadioGroupProps = Omit<FieldProps, 'onAction'>

export default function RadioGroup(props: RadioGroupProps) {
  return (
    <div
      className={TokenList.join([
        'dcl field RadioGroup',
        props.error && 'error',
        props.disabled && 'disabled',
        props.className,
      ])}
    >
      <div className="ui sub header">{props.label}</div>
      <div className="ui input">{props.children}</div>
      <p className="message">{props.message}&nbsp;</p>
    </div>
  )
}
