import React, { useCallback, useState } from 'react'

import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Header } from 'decentraland-ui/dist/components/Header/Header'
import { Mobile, NotMobile } from 'decentraland-ui/dist/components/Media/Media'
import { Tabs } from 'decentraland-ui/dist/components/Tabs/Tabs'

import { Link } from '../../plugins/intl'
import TokenList from '../../utils/dom/TokenList'
import SearchInput from '../Form/SearchInput'

import './NavigationMenu.css'

export type NavigationMenuProps = {
  children: React.ReactNode
  activeTab?: number | string
  actions?: { href: string; children?: React.ReactNode | string }[]
  mobileMenuLabel?: string
  className?: string
  search?: boolean
  searchValue?: string
  onChangeSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default React.memo(function NavigationMenu(props: NavigationMenuProps) {
  const {
    className,
    search,
    searchValue,
    onChangeSearch,
    actions,
    children,
    mobileMenuLabel,
  } = props

  const [toggle, setToggle] = useState(false)

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChangeSearch) {
        onChangeSearch(e)
      }
    },
    [onChangeSearch]
  )
  const handleToggle = (event: React.MouseEvent): void => {
    setToggle(!toggle)
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
  }

  const leftMenu = () => (
    <>{React.Children.map(children, (child, i) => child)}</>
  )

  const rightMenu = () => (
    <>
      {search && (
        <SearchInput
          onChange={handleSearchChange}
          defaultValue={searchValue || ''}
        />
      )}
      {actions &&
        actions.map((action, i) => (
          <Button
            className="action-buttons"
            key={i}
            primary
            size="small"
            as={Link}
            href={action.href}
          >
            {action.children}
          </Button>
        ))}
    </>
  )

  const menu = () => (
    <Tabs>
      <div className="tabs__wrapper">{leftMenu()}</div>
      <div style={{ flex: 1 }} />
      <div className="tabs__wrapper">{rightMenu()}</div>
    </Tabs>
  )

  const mobileMenu = () => (
    <>
      <div className="mobile__wrapper">{leftMenu()}</div>
      <div className="mobile-bottom__wrapper">{rightMenu()}</div>
    </>
  )

  return (
    <div
      className={TokenList.join([
        'navigation-menu',
        className && className,
        toggle && 'open',
      ])}
    >
      <NotMobile>{menu()}</NotMobile>
      <Mobile>
        <div className="dcl navbar__mobile-menu">
          <Header
            size="small"
            className={`dcl active-page ${toggle ? 'caret-up' : 'caret-down'}`}
            onClick={handleToggle}
          >
            {mobileMenuLabel || 'Menu'}
          </Header>
        </div>
      </Mobile>
      <div className="mobile-menu">{mobileMenu()}</div>
    </div>
  )
})
