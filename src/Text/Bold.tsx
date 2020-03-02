import React from "react"
import classname from "../utils/classname"
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
        "Bold",
        primary && "Bold--primary",
        secondary && "Bold--secondary",
        props.className,
      ])}
    />
  )
}
