/**
 * @jest-environment jsdom
 * @jest-environment-options {"customExportConditions":["node","node-addons"]}
 */
import React from 'react'

import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { Network } from '@dcl/schemas/dist/dapps/network'
import useNotifications from 'decentraland-dapps/dist/hooks/useNotifications'
import { Navbar, NavbarProps } from 'decentraland-ui2/dist/components/Navbar'
import {
  Notifications,
  NotificationsProps,
} from 'decentraland-ui2/dist/components/Notifications'
import { renderToStaticMarkup } from 'react-dom/server'

import Layout2, { LayoutProps } from './Layout2'
import useAuthContext from '../../context/Auth/useAuthContext'
import useProfileContext from '../../context/Auth/useProfileContext'
import useShareContext from '../../context/Share/useShareContext'
import useAsyncState from '../../hooks/useAsyncState'
import useChainId from '../../hooks/useChainId'

jest.mock('./Layout2.css', () => ({}))
jest.mock('@dcl/single-sign-on-client', () => ({
  localStorageGetIdentity: jest.fn(),
}))
jest.mock('decentraland-ui2/dist/components/Navbar', () => ({
  Navbar: jest.fn(() => null),
}))
jest.mock('decentraland-ui2/dist/components/Notifications', () => ({
  Notifications: jest.fn(() => null),
}))
jest.mock('decentraland-ui2/dist/config', () => ({
  config: { get: () => 'https://decentraland.org/account' },
}))
jest.mock('decentraland-ui/dist/components/Footer/Footer', () => ({
  Footer: jest.fn(() => null),
}))
jest.mock('decentraland-dapps/dist/hooks/useNotifications', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../../context/Auth/useAuthContext', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../../context/Auth/useProfileContext', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../../context/Auth/utils', () => ({
  getSupportedChainIds: () => [1, 137],
}))
jest.mock('../../context/Share/useShareContext', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../../hooks/useAsyncState', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../../hooks/useChainId', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../../plugins/intl/utils', () => ({ changeLocale: jest.fn() }))
jest.mock('../../utils/development/segment', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../../utils/loader/manaBalance', () => ({
  fetchManaBalance: jest.fn(),
}))
jest.mock('../../utils/segment/trackEvent', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('../Modal/ShareModal', () => ({
  __esModule: true,
  default: () => null,
}))
jest.mock('../Modal/WrongNetworkModal', () => ({
  __esModule: true,
  default: () => null,
}))
jest.mock('../Profile/Avatar', () => ({
  __esModule: true,
  default: () => null,
}))

describe('when Layout2 uses the current UI2 navbar', () => {
  let navbar: NavbarProps
  let authorize: jest.Mock
  let disconnect: jest.Mock
  let switchTo: jest.Mock
  let toggleNotifications: jest.Mock
  let beginNotifications: jest.Mock
  let changeTab: jest.Mock
  let openWindow: jest.SpyInstance
  let props: LayoutProps

  beforeEach(() => {
    jest.useFakeTimers()
    authorize = jest.fn()
    disconnect = jest.fn()
    switchTo = jest.fn()
    toggleNotifications = jest.fn()
    beginNotifications = jest.fn()
    changeTab = jest.fn()
    openWindow = jest.spyOn(window, 'open').mockImplementation(() => null)
    ;(useAuthContext as jest.Mock).mockReturnValue([
      '0x123',
      { authorize, disconnect, switchTo, loading: false },
    ])
    ;(useProfileContext as jest.Mock).mockReturnValue([
      { name: null, avatar: { snapshots: { face256: 'avatar.png' } } },
      { loading: false },
    ])
    ;(useShareContext as jest.Mock).mockReturnValue([
      null,
      { data: null, close: jest.fn() },
    ])
    ;(useAsyncState as jest.Mock).mockReturnValue([{ [Network.ETHEREUM]: 12 }])
    ;(useChainId as jest.Mock).mockReturnValue(ChainId.ETHEREUM_MAINNET)
    ;(useNotifications as jest.Mock).mockReturnValue({
      isModalOpen: true,
      isLoading: false,
      notifications: [],
      isNotificationsOnboarding: true,
      modalActiveTab: 'newest',
      handleNotificationsOpen: toggleNotifications,
      handleOnBegin: beginNotifications,
      handleOnChangeModalTab: changeTab,
    })
    props = {
      hideFooter: true,
      activePage: 'shop',
      navbarProps: { i18n: { shop: 'Store' } },
    } as LayoutProps
    renderToStaticMarkup(<Layout2 {...props} />)
    navbar = jest.mocked(Navbar).mock.calls[0][0]
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
    jest.useRealTimers()
  })

  it('should supply authentication and balances without requiring caller state', () => {
    expect(navbar).toMatchObject({
      isSignedIn: true,
      isSigningIn: false,
      address: '0x123',
      activePage: 'shop',
      i18n: { shop: 'Store' },
      manaBalances: { [Network.ETHEREUM]: 12 },
      selectedChain: 1,
      chains: [1, 137],
    })
    expect(navbar.avatar?.name).toBeUndefined()
    navbar.onClickSignIn()
    expect(authorize).toHaveBeenCalledTimes(1)
  })

  it('should switch chains through the auth context', () => {
    navbar.onSelectChain?.(ChainId.MATIC_MAINNET)
    expect(switchTo).toHaveBeenCalledWith(ChainId.MATIC_MAINNET)
  })

  it('should open the account and disconnect with the new callback signatures', () => {
    navbar.onClickBalance?.(Network.ETHEREUM)
    navbar.onClickSignOut()
    jest.advanceTimersByTime(300)
    expect(openWindow).toHaveBeenCalledWith(
      'https://decentraland.org/account',
      '_blank',
      'noopener'
    )
    expect(disconnect).toHaveBeenCalledTimes(1)
  })

  it('should close notifications only when opening the user card', () => {
    navbar.onToggleUserCard?.(false)
    expect(toggleNotifications).not.toHaveBeenCalled()
    navbar.onToggleUserCard?.(true)
    expect(toggleNotifications).toHaveBeenCalledTimes(1)
  })

  it('should preserve the notification onboarding and tab callbacks inside the slot', () => {
    renderToStaticMarkup(<>{navbar.notificationSlot}</>)
    expect(Notifications).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: 'en',
        isOnboarding: true,
        activeTab: 'newest',
        onBegin: beginNotifications,
        onClick: toggleNotifications,
        onClose: toggleNotifications,
      }),
      expect.anything()
    )
    const notificationProps: NotificationsProps =
      jest.mocked(Notifications).mock.calls[0][0]
    notificationProps.onChangeTab(
      {} as React.MouseEvent<HTMLDivElement>,
      'read' as NotificationsProps['activeTab']
    )
    expect(changeTab).toHaveBeenCalledWith('read')
  })
})
