import React from 'react'
import { IntlShape } from 'gatsby-plugin-intl'
import Markdown from '../../components/Text/Markdown'

export function createFormatMessage(shape: IntlShape) {
  const isEmpty = (id: string) => {
    return !shape.messages[id]
  }

  const str = (id: string, values?: any) => {
    if (isEmpty(id)) {
      return null
    }

    return shape.formatMessage({ id }, { ...values })
  }

  const optional = (id?: string | null, values?: any) => {
    if (!id) {
      return ''
    }

    if (isEmpty(id)) {
      return id
    }

    return shape.formatMessage({ id }, { ...values })
  }

  const markdown = (id: string, values?: any) => {
    let message = str(id, values)

    if (typeof message !== 'string') {
      return message
    }

    return <Markdown key={id} source={message} />
  }

  return Object.assign(str, { markdown, optional, isEmpty })
}
