import React from "react"
import classname from "../utils/classname"
import "./Italic.css"

export type ItalicProps = React.Props<HTMLSpanElement> &
  React.HTMLProps<HTMLSpanElement> & {
    primary?: boolean
    secondary?: boolean
  }

export default function Italic({ primary, secondary, ...props }: ItalicProps) {
  return (
    <span
      {...props}
      className={classname([
        "Italic",
        primary && "Italic--primary",
        secondary && "Italic--secondary",
        props.className,
      ])}
    />
  )
}
