import React, { useEffect, useRef } from 'react'

import { FieldProps } from 'decentraland-ui/dist/components/Field/Field'
import omit from 'lodash/omit'

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

  return (
    <div
      className={TokenList.join([
        'dcl field',
        props.error && 'error',
        props.disabled && 'disabled',
        StyleNamespace,
        'Textarea',
      ])}
    >
      <div className="ui sub header">{props.label}</div>
      <div className="ui input">
        {props.error && (
          <i aria-hidden="true" className="warning circle icon" />
        )}
        <textarea
          {...omit(props, ['error', 'label', 'message'])}
          ref={ref}
          onChange={handleChange}
        />
      </div>
      <p className="message">{props.message}&nbsp;</p>
    </div>
  )
}
