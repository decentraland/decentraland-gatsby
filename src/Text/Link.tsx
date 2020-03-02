import React from "react"
import classname from "../utils/classname"

import "./Link.css"

export type LinkProps = React.Props<HTMLAnchorElement> &
  React.HTMLProps<HTMLAnchorElement> & {
    secondary?: boolean
  }

export default function Link({ secondary, onClick, ...props }: LinkProps) {
  return (
    <a
      {...props}
      className={classname(["Link", props.className])}
    />
  )
}
