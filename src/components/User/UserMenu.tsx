import React from 'react'

import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { UserMenu as BaseUserMenu } from 'decentraland-ui/dist/components/UserMenu/UserMenu'
import { i18n as i18nUserMenu } from 'decentraland-ui/dist/components/UserMenu/UserMenu.i18n'
import { UserMenuProps as BaseUserMenuProps } from 'decentraland-ui/dist/components/UserMenu/UserMenu.types'

import useAuthContext from '../../context/Auth/useAuthContext'
import useProfileInjected from '../../context/Auth/useProfileContext'
import useAsyncState from '../../hooks/useAsyncState'
import useChainId from '../../hooks/useChainId'
import { fetchManaBalance } from '../../utils/loader/manaBalance'
import Avatar from './Avatar'

import type { Network } from '@dcl/schemas/dist/dapps/network'

import './UserMenu.css'

type UserMenuBalances = Partial<Record<Network, number>>

export type UserMenuProps = Partial<
  BaseUserMenuProps & {
    isAuthDappEnabled?: boolean
  }
>

export default function UserMenu(props: UserMenuProps) {
  const i18n = {
    ...i18nUserMenu,
    ...props.i18n,
  }

  const [user, userState] = useAuthContext()
  const [profile, profileState] = useProfileInjected()
  const chainId = useChainId()
  const loading = userState.loading || profileState.loading
  const [manaBalances] = useAsyncState<UserMenuBalances>(async () => {
    if (!user) {
      return {}
    }

    switch (chainId) {
      case ChainId.ETHEREUM_MAINNET: {
        const [ETHEREUM, MATIC] = await Promise.all([
          fetchManaBalance(user, chainId),
          fetchManaBalance(user, ChainId.MATIC_MAINNET),
        ])

        return { ETHEREUM, MATIC }
      }

      case ChainId.ETHEREUM_SEPOLIA:
      case ChainId.ETHEREUM_GOERLI:
      case ChainId.ETHEREUM_RINKEBY:
      case ChainId.ETHEREUM_ROPSTEN: {
        const [ETHEREUM, MATIC] = await Promise.all([
          fetchManaBalance(user, chainId),
          fetchManaBalance(user, ChainId.MATIC_MUMBAI),
        ])

        return { ETHEREUM, MATIC }
      }

      case ChainId.MATIC_MAINNET:
      case ChainId.MATIC_MUMBAI: {
        const MATIC = await fetchManaBalance(user, chainId)
        return { MATIC }
      }

      default:
        return {}
    }
  }, [user, chainId])

  if (loading) {
    return (
      <div>
        <Avatar loading width="42" height="42" />
      </div>
    )
  }

  return (
    <BaseUserMenu
      {...props}
      isSignedIn
      i18n={i18n}
      manaBalances={manaBalances || {}}
      avatar={(profile || undefined) as any}
      onClickSignOut={userState.disconnect}
      onClickSignIn={
        props.isAuthDappEnabled ? userState.authorize : userState.select
      }
    />
  )
}
