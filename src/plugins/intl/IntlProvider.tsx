import React, { useEffect, useMemo, useRef } from 'react'
import { merge } from 'immutable'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'
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
  })

  const intl = useMemo(
    () =>
      createIntl(
        {
          locale: props.locale,
          messages: props.messages,
          defaultLocale: props.defaultLocale,
        },
        intlCache
      ),
    [props.locale, messages, props.defaultLocale]
  )

  useEffect(() => {
    if (window.___decentralandGatsbyIntl !== intl) {
      window.___decentralandGatsbyIntl = intl
    }
  }, [intl])

  return <RawIntlProvider value={{} as any}>{props.children}</RawIntlProvider>
}
