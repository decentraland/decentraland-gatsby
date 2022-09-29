import React, { useCallback, useState } from 'react'

import { Header } from 'decentraland-ui/dist/components/Header/Header'
import { Tabs } from 'decentraland-ui/dist/components/Tabs/Tabs'

import { Link } from '../../plugins/intl'
import TokenList from '../../utils/dom/TokenList'

import './NavigationMenu.css'

export type NavigationMenuProps = {
  leftMenu: React.ReactNode
  rightMenu?: React.ReactNode
  isMobile?: boolean
  isFullScreen?: boolean
  mobileLabel?: string
  className?: string
}

export type NavigationMenuItemProps = {
  href: string
  active: boolean
  children: React.ReactNode
}

const NavigationMenu = React.memo(function NavigationMenu(
  props: NavigationMenuProps
) {
  const { className, isFullScreen, ...rest } = props

  return (
    <div
      className={TokenList.join([
        'navigation-menu',
        className,
        isFullScreen && 'fullscreen',
      ])}
    >
      <Mobile {...rest} />
      <Desktop {...rest} />
    </div>
  )
})

const Item = React.memo(function Item(props: NavigationMenuItemProps) {
  const { href, active, children } = props

  return (
    <Link href={href}>
      <Tabs.Tab active={active}>{children}</Tabs.Tab>
    </Link>
  )
})

const Desktop = React.memo(function NavigationMenuDeskTop(
  props: Pick<NavigationMenuProps, 'leftMenu' | 'rightMenu' | 'isMobile'>
) {
  const { leftMenu, rightMenu, isMobile } = props

  if (isMobile) {
    return null
  }
  return (
    <div className="desktop-menu__container">
      <Tabs>
        <Tabs.Left>{leftMenu}</Tabs.Left>
        {rightMenu && <Tabs.Right>{rightMenu}</Tabs.Right>}
      </Tabs>
    </div>
  )
})

const Mobile = React.memo(function NavigationMenuMobile(
  props: Pick<
    NavigationMenuProps,
    'leftMenu' | 'rightMenu' | 'mobileLabel' | 'isMobile'
  >
) {
  const { leftMenu, rightMenu, mobileLabel, isMobile } = props

  const [toggle, setToggle] = useState(false)

  const handleToggle = useCallback(
    (event: React.MouseEvent): void => {
      setToggle(!toggle)
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation()
    },
    [toggle]
  )

  if (!isMobile) {
    return null
  }

  return (
    <div
      className={TokenList.join(['mobile-menu__container', toggle && 'open'])}
    >
      <div className="navbar__mobile-menu">
        <Header size="small" onClick={handleToggle}>
          {mobileLabel || 'Menu'}
        </Header>
      </div>

      <div className="mobile-menu">
        <div className="mobile__wrapper">{leftMenu}</div>
        <div className="mobile-bottom__wrapper">{rightMenu}</div>
      </div>
    </div>
  )
})

export default Object.assign(NavigationMenu, { Item })
