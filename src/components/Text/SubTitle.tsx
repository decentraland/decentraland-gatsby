import React from "react"
import TokenList from "../../utils/TokenList"
import { createId } from "../../utils/createId"
import { StyleNamespace } from "../../variables"

import "./SubTitle.css"

export type SubTitleProps = React.Props<HTMLHeadingElement> &
  React.HTMLProps<HTMLHeadingElement>

export default function SubTitle(props: SubTitleProps) {
  return <h3 id={createId(props)} {...props} className={TokenList.join([StyleNamespace, "SubTitle", props.className])} />
}
