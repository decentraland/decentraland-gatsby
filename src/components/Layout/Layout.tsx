/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { DropdownProps } from "semantic-ui-react"
import { changeLocale } from "gatsby-plugin-intl"
import { PageProps } from "gatsby"

import trackEvent from "../../utils/segment/trackEvent"
import { Locale } from "decentraland-ui/dist/components/LanguageIcon/LanguageIcon"
import { Footer, FooterProps } from "decentraland-ui/dist/components/Footer/Footer"
import { Navbar, NavbarProps } from "decentraland-ui/dist/components/Navbar/Navbar"

import WalletSelectorModal from "../Modal/WalletSelectorModal"
import "./Layout.css"

export type LayoutProps = PageProps & NavbarProps & FooterProps & {
  pageContext?: {
    intl?: {
      language?: Locale
      languages?: Locale[]
      originalPath?: string
    }
  }
}

export default function Layout({ children, pageContext, ...props }: LayoutProps) {
  const language: Locale = pageContext?.intl?.language || 'en'
  const languages: Locale[] = pageContext?.intl?.languages || ['en']
  const currentPath: string = pageContext?.intl?.originalPath || '/'

  const handleChangeLocal = function (
    _: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) {
    changeLocale(data.value as Locale, currentPath)
  }

  return (
    <>
      <Navbar
        mana={props.mana}
        address={props.address}
        activePage={props.activePage}
        leftMenu={props.leftMenu}
        middleMenu={props.middleMenu}
        rightMenu={props.rightMenu}
        i18n={props.i18n}
        isConnected={props.isConnected}
        isConnecting={props.isConnecting}
        isSignIn={props.isSignIn}
        isFullscreen={props.isFullscreen}
        isOverlay={props.isOverlay}
        className={props.className}
        onSignIn={props.onSignIn}
        onClickAccount={props.onClickAccount}
      />
      <main
        className={props.className}
      >
        {children}
      </main>
      <WalletSelectorModal />
      <Footer
        locale={language}
        locales={languages}
        isFullscreen={props.isFullscreen}
        className={props.className}
        i18n={props.i18n}
        onChange={trackEvent(handleChangeLocal)}
      />
    </>
  )
}
