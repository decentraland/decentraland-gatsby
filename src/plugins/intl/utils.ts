import { navigate as gatsbyNavigate, withPrefix } from 'gatsby'
import { NavigateOptions as RouterNavigateOptions } from '@gatsbyjs/reach-router'
import './types'

export const INTL_LANGUAGE_KEY = `decentraland-gatsby-intl`

export type NavigateOptions<S> = RouterNavigateOptions<S> & {
  locale?: string
}

export function navigate(to: string, options?: NavigateOptions<any>) {
  if (typeof window === 'undefined') {
    return
  }

  const intl = window.___decentralandGatsbyIntl
  if (!intl) {
    return
  }

  const locale = options?.locale ?? intl.locale
  const link = locale === intl.defaultLocale ? to : `/${locale}${to}`
  localStorage.setItem(INTL_LANGUAGE_KEY, locale)
  gatsbyNavigate(link, options)
}

export function changeLocale(locale: string) {
  if (typeof window === 'undefined') {
    return
  }

  const intl = window.___decentralandGatsbyIntl // || {}
  if (!intl || locale === intl.locale) {
    return
  }

  const prefix = withPrefix(
    intl.locale === intl.defaultLocale ? `/` : `/${intl.locale}`
  )
  const pathname = window.location.pathname.slice(0, prefix.length)
  localStorage.setItem(INTL_LANGUAGE_KEY, locale)

  gatsbyNavigate(
    [
      locale === intl.defaultLocale ? `` : `/${locale}`,
      pathname,
      window.location.search,
      window.location.hash,
    ].join('')
  )
}

export function back(fallback: string = '/') {
  if (window.___decentralandNavigationUpdates) {
    window.history.back()
  } else {
    navigate(fallback)
  }
}
