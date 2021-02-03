import React from 'react'
import useAsyncMemo from '../../hooks/useAsyncMemo'
import { StyleNamespace } from '../../variables'
import TokenList from '../../utils/TokenList'
import profiles from '../../utils/store/profiles'

import './Avatar.css'

const DEFAULT_AVATAR = 'https://peer.decentraland.org/content/contents/QmVfTSvEJBtmaHrnmZtpoVCSpv2J69M1wqA97dc53DgbWG'

export type AvatarProps = Omit<React.HTMLProps<HTMLImageElement>, 'height' | 'width' | 'size'> & {
  address?: string,
  size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive' | 'full'
}

export default React.memo(function Avatar({ address, size, src, ...props }: AvatarProps) {

  const [ avatar, loading ] = useAsyncMemo(() => profiles.load(address || ''), [ address ])

  return <img
    loading="lazy"
    {...props as any}
    src={avatar?.avatar?.snapshots?.face || DEFAULT_AVATAR}
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