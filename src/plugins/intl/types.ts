import { IntlShape } from 'react-intl'

declare global {
  interface Window {
    ___decentralandGatsbyIntl?: IntlShape
    ___decentralandNavigationUpdates?: number
  }
}

export type DecentralandIntlPluginOptions = {
  paths: string[]
  locales: string[]
  defaultLocale: string
}

export type DecentralandIntlContext = {
  locale: string
  locales: string[]
  defaultLocale: string
  messages: Record<string, string>
}
