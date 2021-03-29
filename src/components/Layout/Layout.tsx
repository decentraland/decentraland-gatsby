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
import { Footer } from "decentraland-ui/dist/components/Footer/Footer"
import { Locale } from "decentraland-ui/dist/components/LanguageIcon/LanguageIcon"
import { Navbar, NavbarProps } from "decentraland-ui/dist/components/Navbar/Navbar"

import "./Layout.css"
import WalletSelectorModal from "../Modal/WalletSelectorModal"

export type LayoutProps = PageProps & NavbarProps & {
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
      <Navbar {...props} />
      <main>
        {children}
      </main>
      <WalletSelectorModal />
      <Footer
        locale={language}
        locales={languages}
        onChange={trackEvent(handleChangeLocal)}
      />
    </>
  )
}
