import React from "react"
import classname from "../utils/classname"
import "./Title.css"
import { elementId } from "../utils/elementId"

export type TitleProps = React.Props<HTMLHeadingElement> &
  React.HTMLProps<HTMLHeadingElement>

export default function Title(props: TitleProps) {
  return <h2 id={elementId(props)} {...props} className={classname(["Title", props.className])} />
}
