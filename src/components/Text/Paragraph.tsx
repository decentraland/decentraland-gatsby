import React from "react"
import classname from "../../utils/classname"
import { StyleNamespace } from "../../variables"
import "./Paragraph.css"

export type ParagraphProps = React.Props<HTMLParagraphElement> &
  React.HTMLProps<HTMLParagraphElement> & {
    primary?: boolean
    secondary?: boolean
    small?: boolean
    tiny?: boolean
    italic?: boolean
    bold?: boolean
    underline?: boolean
  }

export default function Paragraph({ primary, secondary, small, tiny, bold, italic, underline, ...props }: ParagraphProps) {
  return (
    <p
      {...props}
      className={classname([
        StyleNamespace,
        "Paragraph",
        primary && "Paragraph--primary",
        secondary && "Paragraph--secondary",
        bold && "Paragraph--bold",
        italic && "Paragraph--italic",
        underline && "Paragraph--underline",
        small && "Paragraph--small",
        tiny && "Paragraph--tiny",
        props.className,
      ])}
    />
  )
}
