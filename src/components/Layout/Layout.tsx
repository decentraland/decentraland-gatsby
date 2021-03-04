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

import useWindowScroll from "../../hooks/useWindowScroll"
import trackEvent from "../../utils/segment/trackEvent"
import { Footer } from "decentraland-ui/dist/components/Footer/Footer"
import { Locale } from "decentraland-ui/dist/components/LanguageIcon/LanguageIcon"
import { Navbar } from "decentraland-ui/dist/components/Navbar/Navbar"

import "./Layout.css"

export type LayoutProps = PageProps & {
  rightMenu?: React.ReactNode,
  pageContext?: {
    intl?: {
      language?: Locale
      languages?: Locale[]
      originalPath?: string
    }
  }
}

export default function Layout({ children, rightMenu, pageContext, location }: LayoutProps) {
  const language: Locale = pageContext?.intl?.language || 'en'
  const languages: Locale[] = pageContext?.intl?.languages || ['en']
  const currentPath: string = pageContext?.intl?.originalPath || '/'

  const scroll = useWindowScroll()
  const isScrolled = scroll.scrollY.get() > 0

  const handleChangeLocal = function (
    _: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) {
    changeLocale(data.value as Locale, currentPath)
  }

  return (
    <>
      <Navbar
        className={isScrolled ? "" : "initial"}
        rightMenu={rightMenu || <></>}
      />
      {children}
      <Footer
        locale={language}
        locales={languages}
        onChange={trackEvent(handleChangeLocal)}
      />
    </>
  )
}
