import React, { useMemo, useState } from 'react'
import useAsyncState from '../../hooks/useAsyncState'
import { StyleNamespace } from '../../variables'
import TokenList from '../../utils/dom/TokenList'
import profiles from '../../utils/loader/profile'
import { SizeProps } from '../Props/types'

import './Avatar.css'

const DEFAULT_AVATAR = 'https://decentraland.org/images/male.png'
type Props = SizeProps & {
  src?: string
  address?: string
  loading?: boolean
}

export type AvatarProps = Omit<
  React.HTMLProps<HTMLImageElement>,
  'height' | 'width' | 'size' | 'src'
> &
  Props

export default React.memo(function Avatar({
  address,
  size,
  src,
  loading,
  ...props
}: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const [profile, profileState] = useAsyncState(
    () => profiles.load(address || ''),
    [address],
    { callWithTruthyDeps: true }
  )

  const target = useMemo(() => {
    if (src) {
      return src
    } else if (failed || !profile?.avatar?.snapshots?.face) {
      return DEFAULT_AVATAR
    } else {
      return profile?.avatar?.snapshots?.face
    }
  }, [profile, failed])

  return (
    <img
      loading="lazy"
      {...(props as any)}
      src={!loading ? target : undefined}
      onError={() => setFailed(true)}
      width="128"
      height="128"
      className={TokenList.join([
        StyleNamespace,
        'dcl-avatar',
        `dcl-avatar--${size}`,
        `dcl-avatar--${((address || '')[2] || '').toLowerCase()}`,
        (loading || (!src && profileState.loading)) && `dcl-avatar--loading`,
        props.className,
      ])}
    />
  )
})
