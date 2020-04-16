import React from 'react';
import ReactMarkdown, { ReactMarkdownProps, NodeType } from 'react-markdown'
import Paragraph from './Paragraph';
import Italic from './Italic';
import Bold from './Bold';
import Code from './Code';
import Link from './Link';

export type MarkdownProps = Omit<ReactMarkdownProps, 'renders' | 'linkTarget' | 'astPlugins' | 'plugins'>

export const renderers = {
  paragraph: Paragraph,
  emphasis: Italic,
  strong: Bold,
  link: Link,
  code: Code,
  inlineCode: Code,
}

export const allowedTypes = ['root', 'text'].concat(Object.keys(renderers)) as NodeType[]

export default function Markdown(props: MarkdownProps) {
  return <ReactMarkdown {...props} renderers={renderers} allowedTypes={allowedTypes} />
}