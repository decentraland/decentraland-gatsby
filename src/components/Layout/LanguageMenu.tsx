import React from 'react'

import { GatsbyLinkProps } from 'gatsby'

import { Locale } from 'decentraland-ui/dist/components/Language/Language'
import { NotMobile } from 'decentraland-ui/dist/components/Media/Media'
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu/Menu'
import { MenuItemProps } from 'semantic-ui-react/dist/commonjs/collections/Menu/MenuItem'

import useTrackLinkContext from '../../context/Track/useTrackLinkContext'
import Link from '../../plugins/intl/Link'

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

export type LanguageMenuProps = {
  onClick?: MenuItemProps['onClick']
  languages?: Locale[]
  value?: Locale
  to?: string
}

export default React.memo(function LanguageMenu(props: LanguageMenuProps) {
  if (!props.languages || props.languages.length < 2) {
    return null
  }

  const handleClick = useTrackLinkContext(props.onClick)

  return (
    <NotMobile>
      <Menu secondary stackable>
        {props.languages.map((lang) => (
          <Menu.Item
            key={lang}
            as={Link}
            active={props.value === lang}
            language={lang}
            onClick={handleClick}
            to={props.to || '/'}
          >
            {Label[lang]}
          </Menu.Item>
        ))}
      </Menu>
    </NotMobile>
  )
})
