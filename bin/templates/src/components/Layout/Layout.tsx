/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { DropdownProps } from "semantic-ui-react"
import { changeLocale } from "gatsby-plugin-intl"

import { Footer } from "decentraland-ui/dist/components/Footer/Footer"
import { Locale } from "decentraland-ui/dist/components/LanguageIcon/LanguageIcon"
import { Navbar } from "decentraland-ui/dist/components/Navbar/Navbar"

import "./Layout.css"

export default function Layout({ children, ...props }: any) {
  const language: Locale = props?.pageContext?.intl?.language || 'en'
  const languages: Locale[] = props?.pageContext?.intl?.languages || ['en']
  const currentPath: string = props?.pageContext?.intl?.originalPath || '/'

  function handleChangeLocal(_: any, data: DropdownProps) {
    changeLocale(data.value as Locale, currentPath)
  }

  return (
    <>
      <Navbar rightMenu={null} />
      <div>{children}</div>
      <Footer
        locale={language}
        locales={languages}
        onChange={handleChangeLocal}
      />
    </>
  )
}
