import React from "react"
import TokenList from "../../utils/dom/TokenList"
import { StyleNamespace } from "../../variables"
import "./Underline.css"

export type UnderlineProps = React.Props<HTMLSpanElement> &
  React.HTMLProps<HTMLSpanElement> & {
    primary?: boolean
    secondary?: boolean
  }

export default React.memo(function Underline({ primary, secondary, ...props }: UnderlineProps) {
  return (
    <span
      {...props}
      className={TokenList.join([
        StyleNamespace,
        "Underline",
        primary && "Underline--primary",
        secondary && "Underline--primary",
        props.className,
      ])}
    />
  )
})
