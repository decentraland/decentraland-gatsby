import React from 'react'
import { Profile } from '../../utils/auth/types'
import classname from '../../utils/classname'
import { StyleNamespace } from '../../variables'

import './ImgAvatar.css'

const DEFAULT_AVATAR = 'https://peer.decentraland.org/content/contents/QmVfTSvEJBtmaHrnmZtpoVCSpv2J69M1wqA97dc53DgbWG'

export type ImgAvatarProps = Omit<React.HTMLProps<HTMLImageElement>, 'src' | 'height' | 'width' | 'size'> & {
  profile?: Profile,
  address?: string,
  size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive' | 'full'
}

export default function ImgAvatar({ profile, address, size, ...props }: ImgAvatarProps) {
  const src = profile?.avatar?.avatar?.snapshots?.face || DEFAULT_AVATAR
  const init = (profile?.address || address || '0x0')[2]
  return <img {...props as any} src={src} width="100" height="100" className={classname([StyleNamespace, 'ImgAvatar', `ImgAvatar--${size}`, `ImgAvatar--${init}`, props.className])} />
}