import React from "react"
import classname from "../../utils/classname"
import "./Title.css"
import { createId } from "../../utils/createId"
import { StyleNamespace } from "../../variables"

export type TitleProps = React.Props<HTMLHeadingElement> &
  React.HTMLProps<HTMLHeadingElement> & {
    small?: boolean
  }

export default function Title({ small, ...props }: TitleProps) {
  return <h2 id={createId(props)} {...props} className={classname([StyleNamespace, "Title", small && "Title--small", props.className])} />
}
