import { Radio } from 'decentraland-ui/dist/components/Radio/Radio'
import { Table } from 'decentraland-ui/dist/components/Table/Table'
import React from 'react'
import ReactMarkdown, { Components, Options } from 'react-markdown'
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
  h1: React.memo(({ node, level, ...props }) => <MainTitle {...props} />),
  h2: React.memo(({ node, level, ...props }) => <Title {...props} />),
  h3: React.memo(({ node, level, ...props }) => <SubTitle {...props} />),
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  del: 'del',
  p: React.memo(({ node, ...props }) => <Paragraph {...props} />),
  strong: React.memo(({ node, ...props }) => <Bold {...(props as any)} />),
  em: React.memo(({ node, ...props }) => <Italic {...(props as any)} />),
  a: React.memo(({ node, ...props }) => <Link {...props} />),
  code: React.memo(({ node, ...props }) => {
    const result = (props.className || '').match(/^language-(\w+)$/)
    const language = result ? result[1] : undefined
    return <Code language={language} {...(props as any)} />
  }),
  pre: React.memo(({ node, ...props }) => <pre {...props} />),
  blockquote: React.memo(({ node, ...props }) => <Blockquote {...props} />),
  ol: React.memo(({ node, ...props }) => <List {...props} />),
  ul: React.memo(({ node, ...props }) => <List {...props} />),
  li: React.memo(({ node, ...props }) => <ListItem {...props} />),
  input: React.memo(({ node, disabled, ...props }) => (
    <Radio readOnly={disabled} {...(props as any)} />
  )),
  table: React.memo(({ node, ...props }) => (
    <Table basic="very">{props.children}</Table>
  )),
  tbody: React.memo(({ node, ...props }) => <Table.Body {...props} />),
  thead: React.memo(({ node, ...props }) => <Table.Header {...props} />),
  tr: React.memo(({ node, ...props }) => <Table.Row {...props} />),
  th: React.memo(({ node, isHeader, ...props }) => (
    <Table.HeaderCell {...(props as any)} />
  )),
  td: React.memo(({ node, isHeader, ...props }) => (
    <Table.Cell {...(props as any)} />
  )),
}

export const allowedTypes = ['root', 'text'].concat(Object.keys(components))

export const plugins = [gfm, emoji] as any

export default React.memo(function Markdown(props: MarkdownProps) {
  return (
    <ReactMarkdown {...props} components={components} remarkPlugins={plugins} />
  )
})
