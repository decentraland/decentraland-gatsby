import React from 'react'
import TokenList from '../../utils/dom/TokenList'
import { StyleNamespace } from '../../variables'

import './ImgFixed.css'

export type ImgFixedProps = Omit<React.HTMLProps<HTMLDivElement>, 'size'> & {
  dimension?: 'square' | 'wide' | 'vertical' | 'circle' | 'standard'
  position?: string
  size?: 'cover' | 'contain' | 'initial' | string
  background?: string
}

export default React.memo(function ImgFixed({
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
        `ImgFixed--${dimension || 'square'}`,
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
      <Img dimension={dimension} />
    </div>
  )
})

const Img = React.memo(function (props: Pick<ImgFixedProps, 'dimension'>) {
  switch (props.dimension) {
    case 'vertical':
      return <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAADCAYAAAC56t6BAAAAD0lEQVR4AWNwL/ABY0wGAFT5BhPIHHvgAAAAAElFTkSuQmCC"
        width="2"
        height="3"
      />
    case 'wide':
      return <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAADUlEQVR4AWNwL/ABYwAKHQIHW//QwwAAAABJRU5ErkJggg=="
        width="2"
        height="1"
      />
    case 'standard':
      return <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAD0lEQVR4AWNwL/BBwYQFADuuDCW4Y5knAAAAAElFTkSuQmCC"
        width="4"
        height="3"
      />
    case 'square':
    case 'circle':
    default:
      return <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4AWNwL/BhAAADCQEEiiqnjQAAAABJRU5ErkJggg=="
        width="1"
        height="1"
      />
  }
})