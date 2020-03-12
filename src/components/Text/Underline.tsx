import React from "react"
import classname from "../../utils/classname"
import { StyleNamespace } from "../../variables"
import "./Underline.css"

export type UnderlineProps = React.Props<HTMLSpanElement> &
  React.HTMLProps<HTMLSpanElement> & {
    primary?: boolean
    secondary?: boolean
  }

export default function Underline({ primary, secondary, ...props }: UnderlineProps) {
  return (
    <span
      {...props}
      className={classname([
        StyleNamespace,
        "Underline",
        primary && "Underline--primary",
        secondary && "Underline--primary",
        props.className,
      ])}
    />
  )
}
