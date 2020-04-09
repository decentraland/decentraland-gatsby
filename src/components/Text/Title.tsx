import React from "react"
import { createId } from "../../utils/createId"
import { StyleNamespace } from "../../variables"
import TokenList from "../../utils/TokenList"

import "./Title.css"

export type TitleProps = React.Props<HTMLHeadingElement> &
  React.HTMLProps<HTMLHeadingElement> & {
    small?: boolean
  }

export default function Title({ small, ...props }: TitleProps) {
  return <h2 id={createId(props)} {...props} className={TokenList.join([StyleNamespace, "Title", small && "Title--small", props.className])} />
}
