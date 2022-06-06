import { FieldProps } from 'decentraland-ui/dist/components/Field/Field'
import React, { useEffect, useRef } from 'react'

import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'

import './Textarea.css'

export type TextareaProps = Omit<FieldProps, 'onAction'> & {
  disabled?: boolean
  readOnly?: boolean
  minHeight?: number
  maxHeight?: number
}

export default function Textarea({
  minHeight,
  maxHeight,
  ...props
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null)

  function handleRowChange() {
    if (!ref.current) {
      return
    }

    const textarea = ref.current
    textarea.style.height = 0 + 'px'
    let height = textarea.scrollHeight
    if (minHeight !== undefined && height < minHeight) {
      height = minHeight
    }

    if (maxHeight !== undefined && height > maxHeight) {
      height = maxHeight
    }

    textarea.style.height = height + 2 + 'px'
  }

  function handleChange(event: React.ChangeEvent<any>) {
    if (props.onChange) {
      props.onChange(event, { ...props, value: event.currentTarget.value })
    }

    handleRowChange()
  }

  useEffect(() => handleRowChange(), [])

  const { error, label, message, ...extra } = props

  return (
    <div
      className={TokenList.join([
        'dcl field',
        error && 'error',
        props.disabled && 'disabled',
        StyleNamespace,
        'Textarea',
      ])}
    >
      <div className="ui sub header">{label}</div>
      <div className="ui input">
        {error && <i aria-hidden="true" className="warning circle icon" />}
        <textarea {...extra} ref={ref} onChange={handleChange} />
      </div>
      <p className="message">{message}&nbsp;</p>
    </div>
  )
}
