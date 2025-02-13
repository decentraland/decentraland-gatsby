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
  NAVBAR_DOWNLOAD_EVENT,
  NAVBAR_DOWNLOAD_EVENT_PLACE,
} from 'decentraland-dapps/dist/containers/Navbar/constants'
import useNotifications from 'decentraland-dapps/dist/hooks/useNotifications'
import {
  Footer,
  FooterProps,
} from 'decentraland-ui/dist/components/Footer/Footer'
import { Locale } from 'decentraland-ui/dist/components/LanguageIcon/LanguageIcon'
import { config } from 'decentraland-ui2/dist/config'

import {
  ManaBalancesProps,
  Navbar,
  NavbarProps,
  NotificationActiveTab,
  NotificationLocale,
  dclAddressUtils,
} from 'decentraland-ui2'

import useAuthContext from '../../context/Auth/useAuthContext'
import useProfileInjected from '../../context/Auth/useProfileContext'
import { getSupportedChainIds } from '../../context/Auth/utils'
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
import WrongNetworkModal from '../Modal/WrongNetworkModal'
import Profile from '../Profile/Avatar'

import type { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import type { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown'

import './Layout2.css'

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

export default function Layout2({
  children,
  pageContext,
  hideNavbar,
  hideFooter,
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
          <Profile address={address} size="tiny" />{' '}
          {dclAddressUtils.shorten(address)}
        </div>
      ),
    }),
    [
      locale,
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

  const handleClickDownload = useCallback(
    function (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      options: {
        href?: string
      }
    ) {
      event.preventDefault()
      segment((analytics) => {
        analytics.track(NAVBAR_DOWNLOAD_EVENT, {
          ...options,
          place: NAVBAR_DOWNLOAD_EVENT_PLACE,
        })
      })
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

  const [profile, profileState] = useProfileInjected()
  const chainId = useChainId()
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
      event: React.MouseEvent<
        HTMLButtonElement | HTMLAnchorElement,
        MouseEvent
      >,
      network?: Network
    ) => {
      event.preventDefault()

      if (network) {
        segment((analytics) => {
          analytics.track(DROPDOWN_MENU_BALANCE_CLICK_EVENT, { network })
        })
      }

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
          onClickSignIn={userState.authorize}
          onClickSignOut={handleSignOut}
          notifications={notificationProps}
          onClickDownload={handleClickDownload}
        />
      )}

      <main className="layout__main-container">{children}</main>
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
