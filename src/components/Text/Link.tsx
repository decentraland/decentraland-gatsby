import React, { useMemo } from 'react'

import { withPrefix } from 'gatsby'

import { isLocalLink } from '../../utils/dom/links'
import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'

import './Link.css'

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

export default React.memo(function Link({
  target,
  rel,
  href,
  ...props
}: LinkProps) {
  const isLocal = useMemo(() => isLocalLink(href), [href])
  const linkTarget = useMemo(
    () => (!target && !isLocal ? '_blank' : target || undefined),
    [isLocal, target]
  )
  const linkRel = useMemo(
    () =>
      !isLocal ? TokenList.from(rel, 'noopener', 'noreferrer').value : rel,
    [isLocal, rel]
  )

  return (
    <a
      {...props}
      href={isLocal && href ? withPrefix(href) : href}
      className={TokenList.join([
        StyleNamespace,
        'Link',
        (props.onClick || href) && 'Link--pointer',
        props.className,
      ])}
      target={linkTarget}
      rel={linkRel}
    />
  )
})
