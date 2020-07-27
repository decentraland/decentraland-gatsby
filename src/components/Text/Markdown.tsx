import React from 'react';
import ReactMarkdown, { ReactMarkdownProps, NodeType } from 'react-markdown'
import { Table } from 'decentraland-ui/dist/components/Table/Table'
import SubTitle from './SubTitle';
import Paragraph from './Paragraph';
import Italic from './Italic';
import Bold from './Bold';
import Code from './Code';
import Link from './Link';

export type MarkdownProps = Omit<ReactMarkdownProps, 'renders' | 'linkTarget' | 'astPlugins' | 'plugins'>

export const renderers = {
  heading: SubTitle,
  paragraph: Paragraph,
  emphasis: Italic,
  strong: Bold,
  link: Link,
  code: Code,
  inlineCode: Code,
  table: (props: React.Props<any>) => <Table basic="very">{props.children}</Table>,
  tableHead: (props: React.Props<any>) => <Table.Header>{props.children}</Table.Header>,
  tableBody: (props: React.Props<any>) => <Table.Body>{props.children}</Table.Body>,
  tableRow: (props: React.Props<any>) => <Table.Row>{props.children}</Table.Row>,
  tableCell: (props: React.Props<any> & { isHeader: boolean, align?: 'center' | 'left' | 'right' }) => props.isHeader ?
    <Table.HeaderCell textAlign={props.align || undefined}>{props.children}</Table.HeaderCell> :
    <Table.Cell textAlign={props.align || undefined}>{props.children}</Table.Cell>,
}

export const allowedTypes = ['root', 'text'].concat(Object.keys(renderers)) as NodeType[]

export default function Markdown(props: MarkdownProps) {
  return <ReactMarkdown {...props} renderers={renderers} allowedTypes={allowedTypes} />
}