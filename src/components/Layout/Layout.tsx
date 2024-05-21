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
import { Avatar } from '@dcl/schemas/dist/platform/profile/avatar'
import { localStorageGetIdentity } from '@dcl/single-sign-on-client'
import {
  DROPDOWN_MENU_BALANCE_CLICK_EVENT,
  DROPDOWN_MENU_DISPLAY_EVENT,
  DROPDOWN_MENU_ITEM_CLICK_EVENT,
  DROPDOWN_MENU_SIGN_OUT_EVENT,
} from 'decentraland-dapps/dist/containers/Navbar/constants'
import useNotifications from 'decentraland-dapps/dist/hooks/useNotifications'
import { shorten } from 'decentraland-ui/dist/components/AddressField/utils'
import {
  Footer,
  FooterProps,
} from 'decentraland-ui/dist/components/Footer/Footer'
import { Locale } from 'decentraland-ui/dist/components/LanguageIcon/LanguageIcon'
import { Navbar } from 'decentraland-ui/dist/components/Navbar/Navbar'
import { NavbarProps } from 'decentraland-ui/dist/components/Navbar/Navbar.types'
import {
  NotificationActiveTab,
  NotificationLocale,
} from 'decentraland-ui/dist/components/Notifications/types'
import { ManaBalancesProps } from 'decentraland-ui/dist/components/UserMenu/ManaBalances/ManaBalances.types'
import { config } from 'decentraland-ui/dist/config'

import useAuthContext from '../../context/Auth/useAuthContext'
import useProfileInjected from '../../context/Auth/useProfileContext'
import { getSupportedChainIds } from '../../context/Auth/utils'
import { useFeatureFlagContext } from '../../context/FeatureFlag'
import { DappsFeatureFlags } from '../../context/FeatureFlag/types'
import useShareContext from '../../context/Share/useShareContext'
import useTrackLinkContext from '../../context/Track/useTrackLinkContext'
import useAsyncState from '../../hooks/useAsyncState'
import useChainId from '../../hooks/useChainId'
import { DecentralandIntlContext } from '../../plugins/intl/types'
import { changeLocale } from '../../plugins/intl/utils'
import segment from '../../utils/development/segment'
import TokenList from '../../utils/dom/TokenList'
import { fetchManaBalance } from '../../utils/loader/manaBalance'
import trackEvent from '../../utils/segment/trackEvent'
import ShareModal from '../Modal/ShareModal'
import WalletSelectorModal from '../Modal/WalletSelectorModal'
import WrongNetworkModal from '../Modal/WrongNetworkModal'
import Profile from '../Profile/Avatar'

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
  const [ff] = useFeatureFlagContext()
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
    isNotificationsOnboarding,
    modalActiveTab,
    isLoading,
    notifications,
    handleNotificationsOpen,
    handleOnBegin,
    handleOnChangeModalTab,
  } = useNotifications(identity, true)

  const notificationProps = useMemo(
    () => ({
      locale: locale as NotificationLocale,
      isLoading,
      isOnboarding: isNotificationsOnboarding,
      isOpen: isModalOpen,
      items: notifications,
      activeTab: modalActiveTab,
      identity,
      onClick: handleNotificationsOpen,
      onClose: handleNotificationsOpen,
      onBegin: handleOnBegin,
      onChangeTab: (_: unknown, tab: NotificationActiveTab) =>
        handleOnChangeModalTab(tab),
      renderProfile: (address: string) => (
        <div className="layout__notifications-profile">
          <Profile address={address} size="tiny" /> {shorten(address)}
        </div>
      ),
    }),
    [
      isLoading,
      isNotificationsOnboarding,
      isModalOpen,
      notifications,
      modalActiveTab,
      handleNotificationsOpen,
      handleNotificationsOpen,
      handleOnBegin,
      handleOnChangeModalTab,
    ]
  )

  const handleChangeLocal = function (
    _: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) {
    changeLocale(data.value as string)
  }

  const handleClickUserMenuOption = useTrackLinkContext(
    function (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      options: {
        type: string
        url?: string
        track_uuid?: string
      }
    ) {
      event.preventDefault()
      segment((analytics) => {
        analytics.track(DROPDOWN_MENU_ITEM_CLICK_EVENT, options)
      })

      if (props.onClickUserMenuItem) {
        props.onClickUserMenuItem(event, options)
      }

      return null
    },
    [props.onClickUserMenuItem]
  )

  const handleClickNavbarOption = useTrackLinkContext(
    function (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      options: {
        eventTrackingName: string
        url?: string
        isExternal?: boolean
      }
    ) {
      segment((analytics) => {
        analytics.track('Click on Navbar', options)
      })
      if (props.onClickNavbarItem) {
        props.onClickNavbarItem(event, options)
      }

      return null
    },
    [props.onClickNavbarItem]
  )

  const handleSwitchNetwork = useCallback(
    (chainId: ChainId) => userState.switchTo(chainId),
    [userState]
  )

  const handleConnect = useCallback(
    (providerType: ProviderType, chainId: ChainId) =>
      userState.connect(providerType, chainId),
    [userState]
  )

  const handleCancelConnect = useCallback(
    () => userState.select(false),
    [userState]
  )

  const [profile, profileState] = useProfileInjected()
  const chainId = useChainId()
  const isAuthDappEnabled = ff.enabled(DappsFeatureFlags.AuthDappEnabled)
  const loading = userState.loading || profileState.loading

  const [manaBalances] = useAsyncState<
    ManaBalancesProps['manaBalances']
  >(async () => {
    if (!user) {
      return {}
    }

    const manaBalance = await fetchManaBalance(user, chainId)

    return manaBalance
  }, [user, chainId])

  const handleClickBalance = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      network: Network
    ) => {
      event.preventDefault()
      segment((analytics) => {
        analytics.track(DROPDOWN_MENU_BALANCE_CLICK_EVENT, { network })
      })

      setTimeout(() => {
        window.open(config.get('ACCOUNT_URL'), '_blank', 'noopener')
      }, 300)
    },
    []
  )

  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, track_uuid: string) => {
      segment((analytics) => {
        analytics.track(DROPDOWN_MENU_DISPLAY_EVENT, { track_uuid })
      })
    },
    []
  )

  const handleSignOut = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, track_uuid: string) => {
      segment((analytics) => {
        analytics.track(DROPDOWN_MENU_SIGN_OUT_EVENT, { track_uuid })
      })
      setTimeout(() => {
        userState.disconnect()
      }, 300)
    },
    [userState.disconnect]
  )

  return (
    <>
      {!hideNavbar && (
        <Navbar
          manaBalances={manaBalances as ManaBalancesProps['manaBalances']}
          address={user || undefined}
          avatar={(profile as Avatar) || undefined}
          activePage={props.activePage}
          isSignedIn={!!profile}
          isSigningIn={loading}
          onClickBalance={handleClickBalance}
          onClickNavbarItem={handleClickNavbarOption}
          onClickUserMenuItem={handleClickUserMenuOption}
          onClickOpen={handleOpen}
          onClickSignIn={
            isAuthDappEnabled ? userState.authorize : userState.select
          }
          onClickSignOut={handleSignOut}
          notifications={notificationProps}
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
        currentNetwork={userState.chainId}
        isSwitching={userState.loading}
        expectedNetwork={getSupportedChainIds()}
        onSwitchNetwork={handleSwitchNetwork}
        providerType={userState.providerType}
      />
      <WalletSelectorModal
        open={userState.selecting}
        loading={userState.loading}
        error={userState.error}
        onConnect={handleConnect}
        availableProviders={availableProviders}
        disabledWalletConnect2={!ff.enabled(DappsFeatureFlags.WalletConnectV2)}
        onClose={handleCancelConnect}
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
