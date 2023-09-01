import React, { useCallback } from 'react'

import Highlight from 'react-highlight'

import useClipboardCopy from '../../hooks/useClipboardCopy'
import Time from '../../utils/date/Time'
import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'

import 'highlight.js/styles/github.css'
import './Code.css'

export type CodeProps = React.HTMLProps<HTMLPreElement> &
  React.HTMLProps<HTMLSpanElement> & {
    inline?: boolean
    note?: React.ReactNode
    preview?: React.ReactNode
    copy?: boolean
    language?: 'json' | 'typescript' | 'javascript' | string
  }

export default React.memo(function Code({
  inline,
  children,
  note,
  copy,
  value,
  preview,
  language,
  ...props
}: CodeProps) {
  const [copied, state] = useClipboardCopy(Time.Second)
  const handleCopy = useCallback(() => {
    state.copy(String(children ?? value ?? ''))
  }, [state.copy, children, value])
  return (
    <pre
      {...props}
      className={TokenList.join([
        StyleNamespace,
        'Code',
        !!note && 'Code--with-note',
        !!copy && 'Code--with-copy',
        !!preview && 'Code--with-preview',
        !inline && 'Code--block',
        inline && 'Code--inline',
        props.className,
      ])}
    >
      {!inline && note && <div className={'Code__Note'}>{note}</div>}
      {!inline && preview && <div className="Code__Preview">{preview}</div>}
      {!language && <pre>{children ?? value}</pre>}
      {language && (
        <Highlight className={language}>{children ?? value}</Highlight>
      )}
      {!inline && copy && (
        <div
          className={TokenList.join(['Code__Copy', !!copied && 'active'])}
          onClick={handleCopy}
        >
          {copied ? 'copied' : 'copy'}
        </div>
      )}
    </pre>
  )
})
