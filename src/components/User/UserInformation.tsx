import React from 'react'

import { ChainId } from '@dcl/schemas/dist/dapps/chain-id'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import {
  UserInformationContainer as BaseUserMenu,
  UserInformationComponentProps as BaseUserMenuProps,
  UserInformationComponentI18N,
} from 'decentraland-ui/dist/components/UserInformationContainer/UserInformationContainer'

import useAuthContext from '../../context/Auth/useAuthContext'
import useProfileInjected from '../../context/Auth/useProfileContext'
import useAsyncState from '../../hooks/useAsyncState'
import useChainId from '../../hooks/useChainId'
import { fetchManaBalance } from '../../utils/loader/manaBalance'
import Avatar from './Avatar'

import type { Network } from '@dcl/schemas/dist/dapps/network'

import './UserInformation.css'

type UserMenuBalances = Partial<Record<Network, number>>

export type UserInformationProps = Partial<
  Pick<
    BaseUserMenuProps,
    'hasActivity' | 'onClickProfile' | 'onClickActivity' | 'onClickSettings'
  > & {
    i18n: Partial<UserInformationComponentI18N>
    hideBalance: boolean
  }
>

export default function UserInformation(props: UserInformationProps) {
  const i18n = {
    ...(BaseUserMenu.defaultProps.i18n as UserInformationComponentI18N),
    ...props.i18n,
  }
  const [user, userState] = useAuthContext()
  const [profile, profileState] = useProfileInjected()
  const chainId = useChainId()
  const loading = userState.loading || profileState.loading
  const [manaBalances] = useAsyncState<UserMenuBalances>(async () => {
    if (props.hideBalance || !user) {
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
  }, [user, chainId, props.hideBalance])

  if (loading) {
    return (
      <div>
        <Avatar loading width="42" height="42" />
      </div>
    )
  }

  if (!user) {
    return (
      <div>
        <Button
          primary
          size="small"
          loading={loading}
          disabled={loading}
          onClick={() => userState.select()}
        >
          {i18n.signIn}
        </Button>
      </div>
    )
  }

  return (
    <div className={`dcl-avatar--${user[2]}`}>
      <BaseUserMenu
        {...props}
        isSignedIn
        i18n={i18n}
        manaBalances={manaBalances || {}}
        avatar={(profile || undefined) as any}
        onSignOut={userState.disconnect}
      />
    </div>
  )
}
