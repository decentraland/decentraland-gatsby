import React from 'react'
import classname from '../../utils/classname'
import { StyleNamespace } from '../../variables'

import './ImgFixed.css'

export type ImgFixedProps = Omit<React.HTMLProps<HTMLDivElement>, 'size'> & {
  dimension?: 'square' | 'wide' | 'vertical'
  position?: string
  size?: 'cover' | 'contain'
  background?: string
}

export default function ImgFixed({ src, dimension, size, background, position, ...props }: ImgFixedProps) {
  return <div {...props}
    className={classname([StyleNamespace, 'ImgFixed', props.className])}
    style={{
      ...props.style,
      backgroundColor: background || 'transparent',
      backgroundSize: size || 'cover',
      backgroundPosition: position || 'center center',
      backgroundImage: src && `url("${src}")`
    }}
  >
    {(!dimension || dimension === 'square') && <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4AWNwL/BhAAADCQEEiiqnjQAAAABJRU5ErkJggg==" width="1" height="1" />}
    {dimension === 'wide' && <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAADUlEQVR4AWNwL/ABYwAKHQIHW//QwwAAAABJRU5ErkJggg==" width="2" height="1" />}
    {dimension === 'vertical' && <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAADklEQVR4AWNwL/BhABMACyECB9kZjBwAAAAASUVORK5CYII=" width="1" height="2" />}
  </div>
}