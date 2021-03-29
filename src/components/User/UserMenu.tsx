import React from 'react'
import { Network } from '@dcl/schemas'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { UserMenu as BaseUserMenu, UserMenuProps as BaseUserMenuProps, UserMenuI18N } from 'decentraland-ui/dist/components/UserMenu/UserMenu'
import useAuthContext from '../../context/Auth/useAuthContext'
import useProfileInjected from '../../context/Auth/useProfileContext'
import useAsyncMemo from '../../hooks/useAsyncMemo'

type UserMenuBalances = Partial<Record<Network, number>>

export type UserMenuProps = Pick<BaseUserMenuProps,
  | 'menuItems'
  | 'hasActivity'
  | 'onClickProfile'
  | 'onClickActivity'
  | 'onClickSettings'
> & {
  i18n?: Partial<UserMenuI18N>
  onClickSignIn?: () => void
  onClickSignOut?: () => void
}

export default function UserMenu(props: UserMenuProps) {
  const i18n = { ...BaseUserMenu.defaultProps.i18n as UserMenuI18N, ...props.i18n }
  const [ user, userState ] = useAuthContext()
  const [ , profileState ] = useProfileInjected()
  const loading = userState.loading || profileState.loading
  const [ manaBalances ] = useAsyncMemo(
    async () => {
      const result: UserMenuBalances = {}
      // TODO: load balance
      return result
    },
    [ user, userState.chainId ]
  )

  if (!user) {
    return <Button size="small" basic
      loading={loading}
      disabled={loading}
      onClick={props.onClickSignIn}>{i18n.signIn}</Button>
  }

  return <BaseUserMenu i18n={i18n} manaBalances={manaBalances || {}} />
}