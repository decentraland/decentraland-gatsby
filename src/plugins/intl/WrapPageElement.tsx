import React, { useEffect, useMemo } from 'react'
import { WrapPageElementBrowserArgs, WrapPageElementNodeArgs } from 'gatsby'
import { DecentralandIntlContext, DecentralandIntlPluginOptions } from './types'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'

const cacheIntl = createIntlCache()

type WrapPageArgs =
  | WrapPageElementNodeArgs<any, { intl: DecentralandIntlContext }>
  | WrapPageElementBrowserArgs<any, { intl: DecentralandIntlContext }>

export default function WrapPageElement(
  { element, props }: WrapPageArgs,
  _options: DecentralandIntlPluginOptions
) {
  const ctx = props.pageContext.intl
  const intl = useMemo(
    () =>
      createIntl(
        {
          locale: ctx.locale,
          messages: ctx.messages,
          defaultLocale: ctx.defaultLocale,
        },
        cacheIntl
      ),
    [ctx.locale, ctx.messages]
  )

  useEffect(() => {
    window.___decentralandGatsbyIntl = intl
  }, [intl])

  return <RawIntlProvider value={intl}>{element}</RawIntlProvider>
}
