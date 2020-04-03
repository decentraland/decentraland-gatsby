import React from "react"
import className from "~/utils/className"

import "./Background.css"

export type BackgroundProps = React.Props<HTMLDivElement> &
  React.HTMLProps<HTMLDivElement> & {
    src?: string
  }

export default function Background({ src, ...props }: BackgroundProps) {
  return (
    <div
      {...props}
      className={className(["Background", props.className])}
      style={{
        ...props.style,
        backgroundImage: `url("${src}")`,
      }}
    />
  )
}
