import React from "react"
import classname from "../../utils/classname"
import { StyleNamespace } from "../../variables"
import "./Bold.css"

export type BoldProps = React.Props<HTMLSpanElement> &
  React.HTMLProps<HTMLSpanElement> & {
    primary?: boolean
    secondary?: boolean
  }

export default function Bold({ primary, secondary, ...props }: BoldProps) {
  return (
    <span
      {...props}
      className={classname([
        StyleNamespace,
        "Bold",
        primary && "Bold--primary",
        secondary && "Bold--secondary",
        props.className,
      ])}
    />
  )
}
