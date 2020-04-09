import React from "react"
import TokenList from "../../utils/TokenList"
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
    uppercase?: boolean
  }

export default function Paragraph({ primary, secondary, small, tiny, bold, italic, underline, uppercase, ...props }: ParagraphProps) {
  return (
    <p
      {...props}
      className={TokenList.join([
        StyleNamespace,
        "Paragraph",
        primary && "Paragraph--primary",
        secondary && "Paragraph--secondary",
        bold && "Paragraph--bold",
        italic && "Paragraph--italic",
        underline && "Paragraph--underline",
        small && "Paragraph--small",
        tiny && "Paragraph--tiny",
        uppercase && "Paragraph--uppercase",
        props.className,
      ])}
    />
  )
}
