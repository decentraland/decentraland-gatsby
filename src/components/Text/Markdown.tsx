import { Radio } from 'decentraland-ui/dist/components/Radio/Radio'
import { Table } from 'decentraland-ui/dist/components/Table/Table'
import React, { memo } from 'react'
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
  h1: memo(({ node, level, ...props }) => <MainTitle {...props} />),
  h2: memo(({ node, level, ...props }) => <Title {...props} />),
  h3: memo(({ node, level, ...props }) => <SubTitle {...props} />),
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  del: 'del',
  p: memo(({ node, ...props }) => <Paragraph {...props} />),
  strong: memo(({ node, ...props }) => <Bold {...(props as any)} />),
  em: memo(({ node, ...props }) => <Italic {...(props as any)} />),
  a: memo(({ node, ...props }) => <Link {...props} />),
  code: memo(({ node, ...props }) => {
    const result = (props.className || '').match(/^language-(\w+)$/)
    const language = result ? result[1] : undefined
    return <Code language={language} {...(props as any)} />
  }),
  pre: memo(({ node, ...props }) => <pre {...props} />),
  blockquote: memo(({ node, ...props }) => <Blockquote {...props} />),
  ol: memo(({ node, ...props }) => <List {...props} />),
  ul: memo(({ node, ...props }) => <List {...props} />),
  li: memo(({ node, ...props }) => <ListItem {...props} />),
  input: memo(({ node, disabled, ...props }) => (
    <Radio readOnly={disabled} {...(props as any)} />
  )),
  table: memo(({ node, ...props }) => (
    <Table basic="very">{props.children}</Table>
  )),
  tbody: memo(({ node, ...props }) => <Table.Body {...props} />),
  thead: memo(({ node, ...props }) => <Table.Header {...props} />),
  tr: memo(({ node, ...props }) => <Table.Row {...props} />),
  th: memo(({ node, isHeader, ...props }) => (
    <Table.HeaderCell {...(props as any)} />
  )),
  td: memo(({ node, isHeader, ...props }) => (
    <Table.Cell {...(props as any)} />
  )),
}

export const allowedTypes = ['root', 'text'].concat(Object.keys(components))

export const plugins = [gfm, emoji] as any

export default memo(function Markdown(props: MarkdownProps) {
  return (
    <ReactMarkdown {...props} components={components} remarkPlugins={plugins} />
  )
})
