import React from 'react'

import ReactMarkdown, { Components, Options } from 'react-markdown'

import { Radio } from 'decentraland-ui/dist/components/Radio/Radio'
import { Table } from 'decentraland-ui/dist/components/Table/Table'
import omit from 'lodash/omit'
import emoji from 'remark-emoji'
import gfm from 'remark-gfm'

import Blockquote from './Blockquote'
import Bold from './Bold'
import Code from './Code'
import Italic from './Italic'
import Link from './Link'
import List, { ListItem } from './List'
import MainTitle from './MainTitle'
import Paragraph from './Paragraph'
import SubTitle from './SubTitle'
import Title from './Title'

export type MarkdownProps = Omit<
  Options,
  'renders' | 'linkTarget' | 'astPlugins' | 'plugins'
>

export const components: Components = {
  h1: React.memo((props) => <MainTitle {...omit(props, ['node', 'level'])} />),
  h2: React.memo((props) => <Title {...props} />),
  h3: React.memo((props) => <SubTitle {...props} />),
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  del: 'del',
  p: React.memo((props) => <Paragraph {...omit(props, ['node'])} />),
  strong: React.memo((props) => <Bold {...omit(props as any, ['node'])} />),
  em: React.memo((props) => <Italic {...omit(props as any, ['node'])} />),
  a: React.memo((props) => <Link {...omit(props, ['node'])} />),
  code: React.memo((props) => {
    const result = (props.className || '').match(/^language-(\w+)$/)
    const language = result ? result[1] : undefined
    return <Code language={language} {...omit(props as any, ['node'])} />
  }),
  pre: React.memo((props) => <pre {...omit(props, ['node'])} />),
  blockquote: React.memo((props) => <Blockquote {...omit(props, ['node'])} />),
  ol: React.memo((props) => <List {...omit(props, ['node'])} />),
  ul: React.memo((props) => <List {...omit(props, ['node'])} />),
  li: React.memo((props) => <ListItem {...omit(props, ['node'])} />),
  input: React.memo(({ disabled, ...props }) => (
    <Radio readOnly={disabled} {...omit(props as any, ['node'])} />
  )),
  table: React.memo((props) => <Table basic="very">{props.children}</Table>),
  tbody: React.memo((props) => <Table.Body {...omit(props, ['node'])} />),
  thead: React.memo((props) => <Table.Header {...omit(props, ['node'])} />),
  tr: React.memo((props) => <Table.Row {...omit(props, ['node'])} />),
  th: React.memo((props) => (
    <Table.HeaderCell {...omit(props as any, ['node', 'isHeader'])} />
  )),
  td: React.memo((props) => (
    <Table.Cell {...omit(props as any, ['node', 'isHeader'])} />
  )),
}

/** @deprecated */
export const allowedTypes = ['root', 'text'].concat(Object.keys(components))

export const remarkPlugins: Options['remarkPlugins'] = [gfm, emoji]
export const plugins: any = remarkPlugins

export default React.memo(function Markdown(props: MarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      components={props.components ?? components}
      remarkPlugins={props.remarkPlugins ?? plugins}
    />
  )
})
