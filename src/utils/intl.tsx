import React, { useMemo } from "react"
import { useIntl, IntlShape } from "gatsby-plugin-intl"
import Markdown from "../components/Text/Markdown"

// TODO v3: move to hooks dir
// TODO v3: use intl.str formatter as default
// TODO v3: move intl to intl.markdown
// TODO v3: remove iter, use utils/array/iter
export type Formatter = (id: string, values?: any) => JSX.Element | undefined | null

export type IterationData = {
  index: number,
  isFirst: boolean,
  isLast: boolean
}

export function createFormatMessage(shape: IntlShape) {

  const empty = (id: string) => {
    return !shape.messages[id]
  }

  const str = (id: string, values?: any) => {
    if (empty(id)) {
      return null
    }

    return shape.formatMessage({ id }, { ...values })
  }

  const intl = (id: string, values?: any) => {

    let message = str(id, values)

    if (typeof message !== 'string') {
      return message
    }

    return <Markdown key={id} source={message} />
  };

  /** @deprecated */
  const iter = (base: string, items: number, iterator: (formatter: Formatter, data: IterationData) => JSX.Element | undefined | null) => {
    const result = [] as JSX.Element[]
    for (let current = 0; current < items; current++) {
      const formatter = (id: string, values?: any) => intl([base, current, id].join('.'), values)
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

  return Object.assign(intl, { iter, str, empty })
}

export function useFormatMessage() {
  const intl = useIntl()
  return useMemo(() => createFormatMessage(intl), [intl])
}
