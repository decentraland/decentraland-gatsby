import React from "react"
import classname from "../../utils/classname"
import "./Title.css"
import { createId } from "../../utils/createId"
import { StyleNamespace } from "../../variables"

export type TitleProps = React.Props<HTMLHeadingElement> &
  React.HTMLProps<HTMLHeadingElement>

export default function Title(props: TitleProps) {
  return <h2 id={createId(props)} {...props} className={classname([StyleNamespace, "Title", props.className])} />
}
