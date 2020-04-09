import React from "react"
import TokenList from "../../utils/TokenList"
import Highlight from 'react-highlight'
import { StyleNamespace } from "../../variables"

import 'highlight.js/styles/github-gist.css'
import "./Code.css"

export type CodeProps = React.Props<HTMLPreElement> &
  React.HTMLProps<HTMLSpanElement> & {
    inline?: boolean
    note?: React.ReactNode
    language?: "json" | "typescript" | "javascript" | string
  }

export default function Code({ inline, children, note, value, language, ...props }: CodeProps) {
  return (
    <pre
      {...props}
      className={TokenList.join([
        StyleNamespace,
        "Code",
        !!note && "Code--with-note",
        !inline && "Code--block",
        inline && "Code--inline",
        props.className,
      ])}
    >
      {!inline && note && <div className={'Code__Note'}>{note}</div>}
      {!language && <pre>{children ?? value}</pre>}
      {language && <Highlight className={language}>{children ?? value}</Highlight>}
    </pre>
  )
}
