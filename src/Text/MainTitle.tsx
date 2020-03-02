import React from "react"
import classname from "../utils/classname"

import "./MainTitle.css"
import { elementId } from "../utils/elementId"

export type MainTitleProps = React.Props<HTMLHeadingElement> &
  React.HTMLProps<HTMLHeadingElement>

export default function MainTitle(props: MainTitleProps) {
  return <h1 id={elementId(props)} {...props} className={classname(["MainTitle", props.className])} />
}
