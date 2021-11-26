import React from 'react'
import { IntlProvider } from 'react-intl'
import dapps from 'decentraland-dapps/dist/modules/translation/defaults/en.json'
import grow from '../../intl/en.json'
import flatten from 'flat'

const messages: Record<string, string> = flatten({
  ...dapps,
  ...grow,
})

export default function IntlStorybookProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <IntlProvider locale={'en'} messages={messages}>
      {children}
    </IntlProvider>
  )
}
