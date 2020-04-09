import React from 'react'
import { Button, ButtonProps } from 'decentraland-ui/dist/components/Button/Button'
import TokenList from '../../utils/TokenList'
import { StyleNamespace } from '../../variables'
import { Profile } from '../../utils/auth/types'
import useProfile from '../../hooks/useProfile'

import './ConnectButton.css'

export type ConnectButtonI18N = {
  connect: React.ReactNode
  disconnect: React.ReactNode
}

export type ConnectButtonProps = ButtonProps & {
  i18n?: ConnectButtonI18N
  onConnect?: (profile: Profile) => void
  onDisconnect?: () => void
  onFail?: (error: Error) => void
}

export default function ConnectButton({ onConnect, onDisconnect, onFail, onClick, i18n, children, className, ...props }: ConnectButtonProps) {

  const [profile, actions] = useProfile()
  const loading = actions.loading || props.loading

  function createHandleClick(handle: (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => Promise<void>) {
    return async (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
      if (actions.loading) {
        return
      }

      if (onClick) {
        onClick(event as any, data)
      }

      if (!event.isDefaultPrevented()) {
        await handle(event, data)
          .catch((error: Error) => {
            if (onFail) {
              onFail(error)
            }
          })
      }
    }
  }

  const handleConnect = createHandleClick(async (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
    const profile = await actions.connect()
    if (profile && onConnect) {
      onConnect(profile)
    }
  })

  const handleDisconnect = createHandleClick(async (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
    const profile = await actions.disconnect()
    if (!profile && onDisconnect) {
      onDisconnect()
    }
  })

  return <div className={TokenList.join([StyleNamespace, 'ConnectButton', className])}>
    {!profile && <Button {...props} onClick={handleConnect} loading={loading} >
      {i18n && i18n.connect || 'Sign in'}
    </Button>}
    {profile && <Button {...props} onClick={handleDisconnect} loading={loading}>
      {i18n && i18n.disconnect || 'Sign out'}
    </Button>}
  </div>
}