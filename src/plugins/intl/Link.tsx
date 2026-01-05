import React, { useCallback, useMemo } from 'react'

import { useIntl } from 'react-intl'

import { navigate } from './utils'
import BaseLink from '../../components/Text/Link'
import { isMeta } from '../../utils/dom/events'
import { isBlankTarget, isLocalLink } from '../../utils/dom/links'

export type LinkProps<S extends {} = {}> =
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    state?: S
    replace?: boolean
  }

export default React.memo(function Link(props: LinkProps) {
  props.state
  props.replace
  const intl = useIntl()
  const isLocal = useMemo(() => isLocalLink(props.href), [props.href])
  const hrefLang = useMemo(
    () => (!isLocal ? props.hrefLang : props.hrefLang || intl.locale),
    [props.hrefLang, intl.locale]
  )
  const href = useMemo(
    () =>
      !isLocal || hrefLang === intl.defaultLocale
        ? props.href
        : `/${hrefLang}${props.href}`,
    [hrefLang, props.href, intl.defaultLocale, isLocal]
  )

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, ...extra: any[]) => {
      if (props.onClick) {
        ;(props.onClick as any)(event, ...extra)
      }

      const isBlank = isBlankTarget(event.currentTarget.target)
      if (
        !!href &&
        !!isLocal &&
        !event.defaultPrevented &&
        !isBlank &&
        !isMeta(event)
      ) {
        event.preventDefault()
        navigate(href, {
          locale: hrefLang,
          state: props.state,
          replace: props.replace,
        })
      }
    },
    [props.onClick, href, hrefLang, isLocal, props.state, props.replace]
  )

  return (
    <BaseLink
      {...props}
      onClick={handleClick}
      href={href}
      hrefLang={hrefLang}
    />
  )
})
