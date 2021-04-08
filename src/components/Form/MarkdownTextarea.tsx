import React, { useState } from 'react'
import { Radio } from "decentraland-ui/dist/components/Radio/Radio"
import TokenList from '../../utils/dom/TokenList'
import Textarea, { TextareaProps } from './Textarea'
import Markdown from '../Text/Markdown'
import Label from './Label'

type MarkdownTextarea = TextareaProps & { preview?: boolean }

export default function MarkdownTextarea({ preview, className, ...props}: MarkdownTextarea) {
  const [ previewing, setPreviewing ] = useState(preview)

  return <div className={TokenList.join(['MarkdownTextarea', className])}>
    <Radio toggle label="PREVIEW" checked={preview ?? previewing} onChange={() => setPreviewing(!previewing)} style={{ position: 'absolute', right: 0, top: 0 }} />
    {!previewing && <Textarea {...props} />}
    {previewing && <Label>{props.label || ' '}</Label>}
    {previewing && <div style={{ minHeight: '72px', paddingTop: '4px', paddingBottom: '12px' }}><Markdown source={props.value} /></div>}
  </div>

}