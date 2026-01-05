import React from 'react'

import TokenList from '../../utils/dom/TokenList'

import './Background.css'

export type BackgroundProps = React.Props<HTMLDivElement> &
  React.HTMLProps<HTMLDivElement> & {
    src?: string
  }

export default function Background({ src, ...props }: BackgroundProps) {
  return (
    <div
      {...props}
      className={TokenList.join(['Background', props.className])}
      style={{
        ...props.style,
        backgroundImage: `url("${src}")`,
      }}
    />
  )
}
