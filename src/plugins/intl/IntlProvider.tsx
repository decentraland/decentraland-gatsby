import React, { useEffect, useMemo, useRef } from 'react'

import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl'

import { merge } from 'immutable'

import { DecentralandIntlContext } from './types'

const intlCache = createIntlCache()

export type IntlProviderProps = Omit<DecentralandIntlContext, 'locales'> & {
  children: React.ReactNode
}

export default function IntlProvider(props: IntlProviderProps) {
  const ref = useRef<Record<string, string>>()
  const messages = useMemo(
    () => merge(ref.current ?? {}, props.messages),
    [props.locale, props.messages]
  )

  useEffect(() => {
    if (ref.current !== messages) {
      ref.current = messages
    }
  }, [messages])

  const intl = useMemo(
    () =>
      createIntl(
        {
          messages,
          locale: props.locale,
          defaultLocale: props.defaultLocale,
        },
        intlCache
      ),
    [props.locale, messages, props.defaultLocale]
  )

  useEffect(() => {
    if (intl && window.___decentralandGatsbyIntl !== intl) {
      window.___decentralandGatsbyIntl = intl
    }
  }, [intl])

  return <RawIntlProvider value={intl}>{props.children}</RawIntlProvider>
}
