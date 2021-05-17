import React, { useState } from 'react'
import { Radio } from "decentraland-ui/dist/components/Radio/Radio"
import TokenList from '../../utils/dom/TokenList'
import Textarea, { TextareaProps } from './Textarea'
import Markdown from '../Text/Markdown'
import Label from './Label'
import './MarkdownTextarea.css'

type MarkdownTextarea = TextareaProps & { preview?: boolean }

export default function MarkdownTextarea({ preview, label, className, ...props}: MarkdownTextarea) {
  const [ previewing, setPreviewing ] = useState(preview)

  return <div className={TokenList.join(['dcl', 'field', props.error && 'error', 'MarkdownTextarea', className])}>
    <Radio toggle label="PREVIEW" checked={preview ?? previewing} onChange={() => setPreviewing(!previewing)} style={{ position: 'absolute', right: 0, top: 0 }} />
    <Label>{props.label || ""} &nbsp; </Label>
    {!previewing && <Textarea {...props} />}
    {previewing && <div className="MarkdownTextarea__Preview" style={{ minHeight: (props.minHeight || 72) + 'px' }}>
      <Markdown source={props.value} />
    </div>}
    {previewing && <p className="message"> {props.message} &nbsp; </p>}
  </div>

}