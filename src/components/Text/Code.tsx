import React, { useCallback, useEffect, useRef } from 'react'

import hljs from 'highlight.js'

import useClipboardCopy from '../../hooks/useClipboardCopy'
import Time from '../../utils/date/Time'
import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'

import 'highlight.js/styles/github.css'
import './Code.css'

type HighlightCodeProps = {
  language: string
  children: React.ReactNode
}

function HighlightCode({ language, children }: HighlightCodeProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)
    }
  }, [children, language])

  return (
    <pre>
      <code ref={codeRef} className={language}>
        {children}
      </code>
    </pre>
  )
}

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
        <HighlightCode language={language}>{children ?? value}</HighlightCode>
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
