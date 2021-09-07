import React, { useState } from 'react'
import { Radio } from 'decentraland-ui/dist/components/Radio/Radio'
import { Header } from 'decentraland-ui/dist/components/Header/Header'
import TokenList from '../../utils/dom/TokenList'
import Textarea, { TextareaProps } from './Textarea'
import Markdown from '../Text/Markdown'
// import Label from './Label'
import './MarkdownTextarea.css'

type MarkdownTextarea = TextareaProps & {
  preview?: boolean
  previewLabel?: string
}

export default function MarkdownTextarea({
  preview,
  label,
  previewLabel,
  className,
  ...props
}: MarkdownTextarea) {
  const [value, setValue] = useState(props.initialValue ?? '')
  const [previewing, setPreviewing] = useState(preview)
  function handleChange(e: React.FormEvent<any>, data: any) {
    if (props.onChange) {
      props.onChange(e, data)
    }

    if (!e.defaultPrevented) {
      setValue(data.value || '')
    }
  }

  return (
    <div
      className={TokenList.join([
        'dcl',
        'field',
        props.error && 'error',
        'MarkdownTextarea',
        className,
      ])}
    >
      <Header sub>{label || ''} &nbsp; </Header>
      <Radio
        toggle
        label={previewLabel ?? 'PREVIEW'}
        checked={preview ?? previewing}
        onChange={() => setPreviewing(!previewing)}
        style={{ position: 'absolute', right: 0, top: 0 }}
      />
      {!previewing && (
        <Textarea
          {...props}
          value={props.value ?? value}
          onChange={handleChange}
        />
      )}
      {previewing && (
        <div
          className="MarkdownTextarea__Preview"
          style={{ minHeight: (props.minHeight || 72) + 'px' }}
        >
          <Markdown source={props.value ?? value} />
        </div>
      )}
      {previewing && <p className="message"> {props.message} &nbsp; </p>}
    </div>
  )
}
