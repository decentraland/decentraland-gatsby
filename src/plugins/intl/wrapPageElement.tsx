import React, { useEffect, useMemo } from 'react'
import { WrapPageElementBrowserArgs, WrapPageElementNodeArgs } from 'gatsby'
import { DecentralandIntlContext, DecentralandIntlPluginOptions } from './types'
import IntlProvider from './IntlProvider'

type WrapPageArgs =
  | WrapPageElementNodeArgs<any, { intl: DecentralandIntlContext }>
  | WrapPageElementBrowserArgs<any, { intl: DecentralandIntlContext }>

export default function wrapPageElement(
  { element, props }: WrapPageArgs,
  _options: DecentralandIntlPluginOptions
) {
  return <IntlProvider {...props.pageContext.intl}>{element}</IntlProvider>
}
