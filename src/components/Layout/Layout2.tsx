/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
import React, { useCallback, useMemo } from 'react'

import type { PageProps } from 'gatsby'

import { AuthIdentity } from '@dcl/crypto'
import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { Network } from '@dcl/schemas/dist/dapps/network'
import { localStorageGetIdentity } from '@dcl/single-sign-on-client'
import {
  DROPDOWN_MENU_BALANCE_CLICK_EVENT,
  DROPDOWN_MENU_DISPLAY_EVENT,
  DROPDOWN_MENU_SIGN_OUT_EVENT,
} from 'decentraland-dapps/dist/containers/Navbar/constants'
import useNotifications from 'decentraland-dapps/dist/hooks/useNotifications'
import {
  Footer,
  FooterProps,
} from 'decentraland-ui/dist/components/Footer/Footer'
import { Locale } from 'decentraland-ui/dist/components/LanguageIcon/LanguageIcon'
import { shorten } from 'decentraland-ui2/dist/components/AddressField/utils'
import { Navbar, NavbarProps } from 'decentraland-ui2/dist/components/Navbar'
import {
  NotificationActiveTab,
  Notifications,
} from 'decentraland-ui2/dist/components/Notifications'
import { config } from 'decentraland-ui2/dist/config'

import useAuthContext from '../../context/Auth/useAuthContext'
import useProfileInjected from '../../context/Auth/useProfileContext'
import { getSupportedChainIds } from '../../context/Auth/utils'
import useShareContext from '../../context/Share/useShareContext'
import useAsyncState from '../../hooks/useAsyncState'
import useChainId from '../../hooks/useChainId'
import { DecentralandIntlContext } from '../../plugins/intl/types'
import { changeLocale } from '../../plugins/intl/utils'
import segment from '../../utils/development/segment'
import TokenList from '../../utils/dom/TokenList'
import { fetchManaBalance } from '../../utils/loader/manaBalance'
import trackEvent from '../../utils/segment/trackEvent'
import ShareModal from '../Modal/ShareModal'
import WrongNetworkModal from '../Modal/WrongNetworkModal'
import Profile from '../Profile/Avatar'

import type { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import type { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown'

import './Layout2.css'

// Authentication, balances, chains and notifications are supplied by Gatsby contexts.
type NavbarOptions = Omit<
  NavbarProps,
  | 'isSignedIn'
  | 'isSigningIn'
  | 'isLoadingProfile'
  | 'address'
  | 'avatar'
  | 'activePage'
  | 'onClickSignIn'
  | 'onClickSignOut'
  | 'notificationSlot'
  | 'selectedChain'
  | 'chains'
  | 'onSelectChain'
  | 'manaBalances'
  | 'onClickBalance'
  | 'onToggleUserCard'
>

export type LayoutProps = Omit<PageProps, 'children' | 'pageContext'> &
  FooterProps & {
    activePage?: NavbarProps['activePage']
    /** Navbar-specific options, including its translations; footer i18n stays separate. */
    navbarProps?: NavbarOptions
    hideNavbar?: boolean
    hideFooter?: boolean
    pageContext?: {
      intl?: DecentralandIntlContext
    }
    availableProviders?: ProviderType[]
    children?: React.ReactNode
  }

export default function Layout2({
  children,
  pageContext,
  hideNavbar,
  hideFooter,
  navbarProps,
  ...props
}: LayoutProps) {
  const locale = pageContext?.intl?.locale || 'en'
  const locales = pageContext?.intl?.locales || ['en']
  const [user, userState] = useAuthContext()
  const [, shareState] = useShareContext()
  const identity: AuthIdentity | undefined = useMemo(() => {
    if (user) {
      return localStorageGetIdentity(user) ?? undefined
    }
    return undefined
  }, [user])

  const {
    isModalOpen,
    isLoading,
    notifications,
    handleNotificationsOpen,
    isNotificationsOnboarding,
    modalActiveTab,
    handleOnBegin,
    handleOnChangeModalTab,
  } = useNotifications(identity, true)

  const notificationSlot = (
    <Notifications
      locale={locale === 'es' || locale === 'zh' ? locale : 'en'}
      isLoading={isLoading}
      isOpen={isModalOpen}
      items={notifications}
      isOnboarding={isNotificationsOnboarding}
      activeTab={modalActiveTab}
      onClick={handleNotificationsOpen}
      onClose={handleNotificationsOpen}
      onBegin={handleOnBegin}
      onChangeTab={(_, tab: NotificationActiveTab) =>
        handleOnChangeModalTab(tab)
      }
      renderProfile={(address: string) => (
        <div className="layout__notifications-profile">
          <Profile address={address} size="tiny" /> {shorten(address)}
        </div>
      )}
    />
  )

  const handleChangeLocal = function (
    _: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) {
    changeLocale(data.value as string)
  }

  const handleSwitchNetwork = useCallback(
    (chainId: ChainId) => userState.switchTo(chainId),
    [userState]
  )

  const [profile, profileState] = useProfileInjected()
  const chainId = useChainId()
  const loading = userState.loading || profileState.loading

  const [manaBalances] = useAsyncState<
    NavbarProps['manaBalances']
  >(async () => {
    if (!user) {
      return {}
    }

    const manaBalance = await fetchManaBalance(user, chainId)

    return manaBalance
  }, [user, chainId])

  const handleClickBalance = useCallback((network: Network) => {
    segment((analytics) => {
      analytics.track(DROPDOWN_MENU_BALANCE_CLICK_EVENT, { network })
    })
    setTimeout(() => {
      window.open(config.get('ACCOUNT_URL'), '_blank', 'noopener')
    }, 300)
  }, [])

  const handleToggleUserCard = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        segment((analytics) => {
          analytics.track(DROPDOWN_MENU_DISPLAY_EVENT, {})
        })
        if (isModalOpen) handleNotificationsOpen()
      }
    },
    [isModalOpen, handleNotificationsOpen]
  )

  const handleSignOut = useCallback(() => {
    segment((analytics) => {
      analytics.track(DROPDOWN_MENU_SIGN_OUT_EVENT, {})
    })
    setTimeout(() => userState.disconnect(), 300)
  }, [userState.disconnect])

  return (
    <>
      {!hideNavbar && (
        <Navbar
          {...navbarProps}
          manaBalances={manaBalances ?? undefined}
          address={user || undefined}
          avatar={
            profile
              ? { name: profile.name ?? undefined, avatar: profile.avatar }
              : undefined
          }
          activePage={props.activePage}
          isSignedIn={!!profile}
          isSigningIn={loading || (!!user && !profile)}
          onClickBalance={handleClickBalance}
          onToggleUserCard={handleToggleUserCard}
          selectedChain={chainId}
          chains={getSupportedChainIds()}
          onSelectChain={handleSwitchNetwork}
          onClickSignIn={userState.authorize}
          onClickSignOut={handleSignOut}
          notificationSlot={notificationSlot}
        />
      )}

      <main
        className={TokenList.join([
          'layout__main-container',
          hideNavbar && 'hide-navbar',
        ])}
      >
        {children}
      </main>
      <ShareModal data={shareState.data} onClose={shareState.close} />
      <WrongNetworkModal
        currentNetwork={userState.chainId}
        isSwitching={userState.loading}
        expectedNetwork={getSupportedChainIds()}
        onSwitchNetwork={handleSwitchNetwork}
        providerType={userState.providerType}
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
          hideSocialLinks={props.hideSocialLinks}
        />
      )}
    </>
  )
}
