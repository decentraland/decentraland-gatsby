import React from "react"
import classname from "../../utils/classname"
import { createId } from "../../utils/createId"
import { StyleNamespace } from "../../variables"

import "./MainTitle.css"

export type MainTitleProps = React.Props<HTMLHeadingElement> &
  React.HTMLProps<HTMLHeadingElement>

export default function MainTitle(props: MainTitleProps) {
  return <h1 id={createId(props)} {...props} className={classname([StyleNamespace, "MainTitle", props.className])} />
}
