import React, { useMemo } from "react"
import ReactMarkdown, { NodeType } from 'react-markdown'
import { useIntl, IntlShape } from "gatsby-plugin-intl"
import Paragraph from "../components/Text/Paragraph"
import Italic from "../components/Text/Italic"
import Bold from "../components/Text/Bold"
import Link from "../components/Text/Link"
import Code from "../components/Text/Code"

export type Formatter = (id: string, values?: any) => JSX.Element | undefined | null

export type IterationData = {
  index: number,
  isFirst: boolean,
  isLast: boolean
}

export const renderers = {
  paragraph: Paragraph,
  emphasis: Italic,
  strong: Bold,
  link: Link,
  code: Code,
  inlineCode: Code,
}

export const allowedTypes = ['root', 'text'].concat(Object.keys(renderers)) as NodeType[]

// (uri: string, text: string, title?: string) => string
export function linkTarget(uri: string, text: string, title?: string): string {
  if (
    String(uri).startsWith('https://') ||
    String(uri).startsWith('http://') ||
    String(uri).startsWith('//')
  ) {
    return '_blank'
  }

  return ""
}

export function createFormatMessage(intl: IntlShape) {
  const l = (id: string, values?: any) => {
    if (!intl.messages[id]) {
      return null
    }

    let message = intl.formatMessage({ id }, { ...values })

    if (typeof message === 'string') {
      return <ReactMarkdown key={id} source={message} renderers={renderers} linkTarget={linkTarget} allowedTypes={allowedTypes} />
    }

    return message
  };

  const iter = (base: string, items: number, iterator: (formatter: Formatter, data: IterationData) => JSX.Element | undefined | null) => {
    const result = [] as JSX.Element[]
    for (let current = 0; current < items; current++) {
      const formatter = (id: string, values?: any) => l([base, current, id].join('.'), values)
      const message = iterator(formatter, {
        index: current,
        isFirst: current === 0,
        isLast: current === items - 1,
      })

      if (message) {
        result.push(message)
      }
    }

    return result
  }

  return Object.assign(l, { iter })
}

export function useFormatMessage() {
  const intl = useIntl()
  return useMemo(() => createFormatMessage(intl), [intl])
}
