import React from 'react'
import ReactMarkdown, { Options, Components } from 'react-markdown'
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
  Options,
  'renders' | 'linkTarget' | 'astPlugins' | 'plugins'
>

export const components: Components = {
  h1: MainTitle,
  h2: Title,
  h3: SubTitle,
  h4: SubTitle,
  h5: SubTitle,
  h6: SubTitle,
  p: Paragraph as any,
  i: Italic as any,
  b: Bold as any,
  a: Link,
  code: Code as any,
  // inlineCode: Code,
  blockquote: Blockquote,
  ol: 'ol',
  ul: 'ul',
  li: (props) => {
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
  table: (props) => <Table basic="very">{props.children}</Table>,
  th: Table.Header as any,
  tbody: Table.Body as any,
  thead: Table.Header as any,
  tr: Table.Row as any,
  // td: Table.Cell,
  td: (props) =>
    props.isHeader ? (
      <Table.HeaderCell {...(props as any)} />
    ) : (
      <Table.Cell {...(props as any)} />
    ),
}

export const allowedTypes = ['root', 'text'].concat(Object.keys(components))

export default React.memo(function Markdown(props: MarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      components={components}
      allowedElements={allowedTypes}
    />
  )
})
