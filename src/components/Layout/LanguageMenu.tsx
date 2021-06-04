import React from 'react'
import { Locale } from 'decentraland-ui/dist/components/Language/Language'
import { GatsbyLinkProps } from 'gatsby'
import { Link } from 'gatsby-plugin-intl'
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu/Menu'
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive/Responsive'
import trackEvent from '../../utils/segment/trackEvent'

export const Label = {
  en: 'ENG',
  es: 'ESP',
  fr: 'FRA',
  ja: '日本語',
  zh: '中文',
  ko: 'KOR',
}

export type HandleClick = (
  event: React.MouseEvent<GatsbyLinkProps<any>>
) => void

export type LanguageMenuProps = React.Props<Responsive> & {
  onClick?: HandleClick
  languages?: Locale[]
  value?: Locale
  to?: string
}

export default function LanguageMenu(props: LanguageMenuProps) {
  if (!props.languages || props.languages.length < 2) {
    return null
  }

  const minWidth = Responsive.onlyTablet.minWidth

  function handleClick(event: React.MouseEvent<any>) {
    if (props.onClick) {
      props.onClick(event)
    }
  }

  return (
    <Responsive as={Menu} secondary stackable minWidth={minWidth}>
      {props.languages.map((lang) => (
        <Menu.Item
          key={lang}
          as={Link}
          active={props.value === lang}
          language={lang}
          onClick={trackEvent(handleClick)}
          to={props.to || '/'}
        >
          {Label[lang]}
        </Menu.Item>
      ))}
    </Responsive>
  )
}
