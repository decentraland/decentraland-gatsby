import React from "react"
import TokenList from "../../utils/dom/TokenList"
import { createId } from "../../utils/react/createId"
import { StyleNamespace } from "../../variables"

import "./SubTitle.css"

export type SubTitleProps = React.Props<HTMLHeadingElement> &
  React.HTMLProps<HTMLHeadingElement>

export default React.memo(function SubTitle(props: SubTitleProps) {
  return <h3 id={createId(props)} {...props} className={TokenList.join([StyleNamespace, "SubTitle", props.className])} />
})
