import React from 'react'
import { Profile } from '../../utils/auth/types'
import TokenList from '../../utils/TokenList'
import { StyleNamespace } from '../../variables'

import './ImgAvatar.css'

const DEFAULT_AVATAR = 'https://peer.decentraland.org/content/contents/QmVfTSvEJBtmaHrnmZtpoVCSpv2J69M1wqA97dc53DgbWG'

export type ImgAvatarProps = Omit<React.HTMLProps<HTMLImageElement>, 'height' | 'width' | 'size'> & {
  profile?: Profile,
  address?: string,
  size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive' | 'full'
}

export default function ImgAvatar({ profile, address, size, src, ...props }: ImgAvatarProps) {
  const image = src || profile?.avatar?.avatar?.snapshots?.face || DEFAULT_AVATAR
  const init = (address || profile?.address.toString() || '0x0')[2]
  return <img loading="lazy" {...props as any} src={image} width="100" height="100" className={TokenList.join([StyleNamespace, 'ImgAvatar', `ImgAvatar--${size}`, `ImgAvatar--${init}`, props.className])} />
}