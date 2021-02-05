import React, { useMemo, useState } from 'react'
import useAsyncMemo from '../../hooks/useAsyncMemo'
import { StyleNamespace } from '../../variables'
import TokenList from '../../utils/TokenList'
import profiles from '../../utils/store/profiles'

import './Avatar.css'

const DEFAULT_AVATAR = 'https://peer.decentraland.org/content/contents/QmXo9BXGF9Tx6H3hNwMfdMsisogfVgpy1bRwxPQ2D4QhPW'

export type AvatarProps = Omit<React.HTMLProps<HTMLImageElement>, 'height' | 'width' | 'size'> & {
  address?: string,
  size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive' | 'full'
}

export default React.memo(function Avatar({ address, size, src, ...props }: AvatarProps) {

  const [ failed, setFailed ] = useState(false)
  const [ avatar, loading ] = useAsyncMemo(() => profiles.load(address || ''), [ address ])
  const target = useMemo(() => {
    if (src) {
      return src
    } else  if (failed || !(avatar?.avatar?.snapshots?.face)) {
      return DEFAULT_AVATAR
    } else {
      return avatar?.avatar?.snapshots?.face
    }
  }, [ avatar, failed ])

  return <img
    loading="lazy"
    {...props as any}
    src={target}
    onError={() => setFailed(true)}
    width="128"
    height="128"
    className={TokenList.join([
      StyleNamespace,
      'dcl-avatar',
      `dcl-avatar--${size}`,
      `dcl-avatar--${((address || '')[2] || '').toLowerCase()}`,
      loading && `dcl-avatar--loading`,
      props.className
    ])}
  />
})