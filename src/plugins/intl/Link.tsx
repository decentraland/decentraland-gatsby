import React, { useCallback, useMemo } from 'react'

import { useIntl } from 'react-intl'

import BaseLink, {
  isBlankTarget,
  isLocalLink,
} from '../../components/Text/Link'
import { isMeta } from '../../utils/dom/events'
import { navigate } from './utils'

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
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (props.onClick) {
        props.onClick(e)
      }

      const isBlank = isBlankTarget(e.currentTarget.target)
      if (!e.defaultPrevented && !isBlank && !isMeta(e)) {
        e.preventDefault()
        navigate(props.href || '', {
          locale: hrefLang,
          state: props.state,
          replace: props.replace,
        })
      }
    },
    [props.onClick, hrefLang, props.state, props.replace, isLocalLink]
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
