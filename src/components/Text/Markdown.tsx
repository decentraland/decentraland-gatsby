import React from 'react'
import ReactMarkdown, { ReactMarkdownProps, NodeType } from 'react-markdown'
import { Table } from 'decentraland-ui/dist/components/Table/Table'
import MainTitle from './MainTitle'
import Title from './Title'
import SubTitle from './SubTitle'
import Paragraph from './Paragraph'
import Italic from './Italic'
import Bold from './Bold'
import Code from './Code'
import Link from './Link'
import Blockquote from './Blockquote'

export type MarkdownProps = Omit<
  ReactMarkdownProps,
  'renders' | 'linkTarget' | 'astPlugins' | 'plugins'
>

export const renderers: Partial<Record<NodeType, React.ReactType<any>>> = {
  heading: ({ level, ...props }: any) => {
    switch (level) {
      case 1:
        return <MainTitle {...props} />
      case 2:
        return <Title {...props} />
      default:
        return <SubTitle {...props} />
    }
  },
  paragraph: Paragraph,
  emphasis: Italic,
  strong: Bold,
  link: Link,
  code: Code,
  inlineCode: Code,
  blockquote: Blockquote,
  list: (props: any) => {
    switch (props.ordered) {
      case true:
        return <ol start={props.start}>{props.children}</ol>
      case false:
      default:
        return <ul>{props.children}</ul>
    }
  },
  listItem: (props: any) => {
    return (
      <li {...props}>
        <Paragraph>
          {typeof props.checked === 'boolean' && (
            <input
              type="checkbox"
              checked={props.checked}
              readOnly
              style={{ marginRight: '.5em' }}
            />
          )}
          {props.children}
        </Paragraph>
      </li>
    )
  },
  table: (props: React.Props<any>) => (
    <Table basic="very">{props.children}</Table>
  ),
  tableHead: (props: React.Props<any>) => (
    <Table.Header>{props.children}</Table.Header>
  ),
  tableBody: (props: React.Props<any>) => (
    <Table.Body>{props.children}</Table.Body>
  ),
  tableRow: (props: React.Props<any>) => (
    <Table.Row>{props.children}</Table.Row>
  ),
  tableCell: (
    props: React.Props<any> & {
      isHeader: boolean
      align?: 'center' | 'left' | 'right'
    }
  ) =>
    props.isHeader ? (
      <Table.HeaderCell textAlign={props.align || undefined}>
        {props.children}
      </Table.HeaderCell>
    ) : (
      <Table.Cell textAlign={props.align || undefined}>
        {props.children}
      </Table.Cell>
    ),
}

export const allowedTypes = ['root', 'text'].concat(
  Object.keys(renderers)
) as NodeType[]

export default React.memo(function Markdown(props: MarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      renderers={renderers as any}
      allowedTypes={allowedTypes}
    />
  )
})
