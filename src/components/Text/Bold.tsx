import React from "react"
import TokenList from "../../utils/dom/TokenList"
import { StyleNamespace } from "../../variables"
import "./Bold.css"

export type BoldProps = React.Props<HTMLSpanElement> &
  React.HTMLProps<HTMLSpanElement> & {
    primary?: boolean
    secondary?: boolean
  }

export default React.memo(function Bold({ primary, secondary, ...props }: BoldProps) {
  return (
    <span
      {...props}
      className={TokenList.join([
        StyleNamespace,
        "Bold",
        primary && "Bold--primary",
        secondary && "Bold--secondary",
        props.className,
      ])}
    />
  )
})
