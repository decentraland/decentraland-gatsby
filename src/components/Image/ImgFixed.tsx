import React from 'react'
import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'

import './ImgFixed.css'

export type ImgFixedProps = Omit<React.HTMLProps<HTMLDivElement>, 'size'> & {
  dimension?: 'square' | 'wide' | 'vertical' | 'circle'
  position?: string
  size?: 'cover' | 'contain' | 'initial' | string
  background?: string
}

export default function ImgFixed({
  src,
  dimension,
  size,
  background,
  position,
  ...props
}: ImgFixedProps) {
  return (
    <div
      {...props}
      className={TokenList.join([
        StyleNamespace,
        'ImgFixed',
        (!dimension || dimension === 'square') && 'ImgFixed--square',
        dimension === 'vertical' && 'ImgFixed--vertical',
        dimension === 'circle' && 'ImgFixed--circle',
        dimension === 'wide' && 'ImgFixed--wide',
        props.className,
      ])}
      style={{
        ...props.style,
        backgroundColor: background || 'transparent',
        backgroundSize: size || 'cover',
        backgroundPosition: position || 'center center',
        backgroundImage: src && `url("${src}")`,
      }}
    >
      {(!dimension || dimension === 'square' || dimension === 'circle') && (
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4AWNwL/BhAAADCQEEiiqnjQAAAABJRU5ErkJggg=="
          width="1"
          height="1"
        />
      )}
      {dimension === 'wide' && (
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAADUlEQVR4AWNwL/ABYwAKHQIHW//QwwAAAABJRU5ErkJggg=="
          width="2"
          height="1"
        />
      )}
      {dimension === 'vertical' && (
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAADCAYAAAC56t6BAAAAD0lEQVR4AWNwL/ABY0wGAFT5BhPIHHvgAAAAAElFTkSuQmCC"
          width="2"
          height="3"
        />
      )}
    </div>
  )
}
