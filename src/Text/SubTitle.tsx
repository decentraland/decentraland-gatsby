import React from "react"
import classname from "../utils/classname"

import "./SubTitle.css"
import { elementId } from "../utils/elementId"

export type SubTitleProps = React.Props<HTMLHeadingElement> &
  React.HTMLProps<HTMLHeadingElement>

export default function SubTitle(props: SubTitleProps) {
  return <h3 id={elementId(props)} {...props} className={classname(["SubTitle", props.className])} />
}
