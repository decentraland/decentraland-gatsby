import React from "react"
import TokenList from "../../utils/TokenList"
import { createId } from "../../utils/createId"
import { StyleNamespace } from "../../variables"

import "./MainTitle.css"

export type MainTitleProps = React.Props<HTMLHeadingElement> &
  React.HTMLProps<HTMLHeadingElement>

export default function MainTitle(props: MainTitleProps) {
  return <h1 id={createId(props)} {...props} className={TokenList.join([StyleNamespace, "MainTitle", props.className])} />
}
