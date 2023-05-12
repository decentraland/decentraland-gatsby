/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'

import type { PageProps } from 'gatsby'

import {
  Footer,
  FooterProps,
} from 'decentraland-ui/dist/components/Footer/Footer'
import { Locale } from 'decentraland-ui/dist/components/LanguageIcon/LanguageIcon'
import {
  Navbar,
  NavbarProps,
} from 'decentraland-ui/dist/components/Navbar/Navbar'

import useAuthContext from '../../context/Auth/useAuthContext'
import { getSupportedChainIds } from '../../context/Auth/utils'
import useShareContext from '../../context/Share/useShareContext'
import useTrackLinkContext from '../../context/Track/useTrackLinkContext'
import useWindowScroll from '../../hooks/useWindowScroll'
import { DecentralandIntlContext } from '../../plugins/intl/types'
import { changeLocale } from '../../plugins/intl/utils'
import TokenList from '../../utils/dom/TokenList'
import trackEvent from '../../utils/segment/trackEvent'
import ShareModal from '../Modal/ShareModal'
import WalletSelectorModal from '../Modal/WalletSelectorModal'
import WrongNetworkModal from '../Modal/WrongNetworkModal'

import type { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import type { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown'

import './Layout.css'

export type LayoutProps = Omit<PageProps, 'children'> &
  NavbarProps &
  FooterProps & {
    hideNavbar?: boolean
    hideFooter?: boolean
    pageContext?: {
      intl?: DecentralandIntlContext
    }
    availableProviders?: ProviderType[]
    children?: React.ReactNode
  }

export default function Layout({
  children,
  pageContext,
  availableProviders,
  hideNavbar,
  hideFooter,
  ...props
}: LayoutProps) {
  const locale = pageContext?.intl?.locale || 'en'
  const locales = pageContext?.intl?.locales || ['en']
  const [, state] = useAuthContext()
  const [, shareState] = useShareContext()
  const scroll = useWindowScroll() || null
  const isScrolled = scroll.scrollY.get() > 0

  const handleChangeLocal = function (
    _: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) {
    changeLocale(data.value as string)
  }

  const handleClickMenuOption = useTrackLinkContext(
    function (event: React.MouseEvent, section: string) {
      if (props.onClickMenuOption) {
        props.onClickMenuOption(event, section)
      }

      if (!event.defaultPrevented) {
        return {
          place: 'navbar',
          section,
          menu: section.split('_'),
        }
      }

      return null
    },
    [props.onClickMenuOption]
  )

  return (
    <>
      {!hideNavbar && (
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
          className={TokenList.join([
            // TODO(#323): remove on v6 use bem notation
            'LayoutNavbarContainer',
            'layout__navbar',
            props.className,
            !isScrolled && 'initial',
          ])}
          onSignIn={props.onSignIn}
          onClickAccount={props.onClickAccount}
          onClickMenuOption={handleClickMenuOption}
        />
      )}
      <main
        className={TokenList.join([
          // TODO(#323): remove on v6 use bem notation
          'LayoutMainContainer',
          'layout__main',
          props.className,
        ])}
      >
        {children}
      </main>
      <ShareModal data={shareState.data} onClose={shareState.close} />
      <WrongNetworkModal
        currentNetwork={state.chainId}
        expectedNetwork={getSupportedChainIds()}
        onSwitchNetwork={(chainId) => state.switchTo(chainId)}
        providerType={state.providerType}
      />
      <WalletSelectorModal
        open={state.selecting}
        loading={state.loading}
        error={state.error}
        onConnect={(providerType, chainId) =>
          state.connect(providerType, chainId)
        }
        availableProviders={availableProviders}
        onClose={() => state.select(false)}
      />
      {!hideFooter && (
        <Footer
          locale={locale as Locale}
          locales={locales as Locale[]}
          isFullscreen={props.isFullscreen}
          className={TokenList.join([
            // TODO(#323): remove on v6 use bem notation
            'LayoutFooterContainer',
            'layout__footer',
            props.className,
          ])}
          i18n={props.i18n}
          onChange={trackEvent(handleChangeLocal)}
        />
      )}
    </>
  )
}
