import React from 'react'
import ReactDOM from 'react-dom/server'
import { createIntl } from 'react-intl';
import { createFormatMessage, Formatter } from './intl'
import flat from 'flat'
import Paragraph from '../components/Text/Paragraph'
import Italic from '../components/Text/Italic'
import Bold from '../components/Text/Bold'
import Link from '../components/Text/Link'
import Code from '../components/Text/Code';

describe(__filename, () => {
  const intl = createIntl({
    locale: 'en', messages: flat({
      paragraph: '1rt paragraph: regular message.',
      decorations: '2nd paragraph: *italic*, **bold**, [innerLink](#) and [outerLink](https://decentraland.com).',
      breakLine: '1rt paragraph\n\n2nd paragraph.',
      list: [
        { text: 'item 1 ({index}, {isFirst}, {isLast}).' },
        { text: 'item 2 ({index}, {isFirst}, {isLast}).' },
        { text: 'item 3 ({index}, {isFirst}, {isLast}).' },
      ],
      code: 'code block:\n\n```\n  const variable = "value";\n```\n\nthis is and example.',
      inlineCode: 'inline `code` example.',
      highlightCode: 'code block:\n\n```typescript\n  const variable = "value";\n```\n\nthis is and example.'
    })
  })

  const l = createFormatMessage(intl)

  function expectRender(element: JSX.Element[] | JSX.Element | null, toBe: JSX.Element | null) {
    return expect(element && ReactDOM.renderToStaticMarkup(<>{element}</>))
      .toBe(toBe && ReactDOM.renderToStaticMarkup(toBe))
  }

  test(`l("invalid")`, () => expectRender(l('invalid'), null))
  test(`l("paragraph")`, () => expectRender(l('paragraph'), <Paragraph>1rt paragraph: regular message.</Paragraph>))
  test(`l("decorations")`, () => expectRender(l('decorations'), <Paragraph>2nd paragraph: <Italic>italic</Italic>, <Bold>bold</Bold>, <Link target="" href="#">innerLink</Link> and <Link target="_blank" href="https://decentraland.com">outerLink</Link>.</Paragraph>))
  test(`l("breakLine")`, () => expectRender(
    l('breakLine'),
    <>
      <Paragraph>1rt paragraph</Paragraph>
      <Paragraph>2nd paragraph.</Paragraph>
    </>
  ))

  const iterator = (l: Formatter, data?: any) => l('text', { ...data, isFirst: String(data.isFirst), isLast: String(data.isLast) })
  test(`l.iter("list", 1, ...)`, () => expectRender(
    l.iter('list', 1, iterator),
    <>
      <Paragraph>item 1 (0, true, true).</Paragraph>
    </>
  ))
  test(`l.iter("list", 3, ...)`, () => expectRender(
    l.iter('list', 3, iterator),
    <>
      <Paragraph>item 1 (0, true, false).</Paragraph>
      <Paragraph>item 2 (1, false, false).</Paragraph>
      <Paragraph>item 3 (2, false, true).</Paragraph>
    </>
  ))
  test(`l.iter("list", 20, ...)`, () => expectRender(
    l.iter('list', 20, iterator),
    <>
      <Paragraph>item 1 (0, true, false).</Paragraph>
      <Paragraph>item 2 (1, false, false).</Paragraph>
      <Paragraph>item 3 (2, false, false).</Paragraph>
    </>
  ))
  test(`l("code")`, () => expectRender(l('code'), <>
    <Paragraph>code block:</Paragraph>
    <Code>{`  const variable = "value";`}</Code>
    <Paragraph>this is and example.</Paragraph>
  </>))
  test(`l("inlineCode")`, () => expectRender(l('inlineCode'), <Paragraph>inline <Code inline>code</Code> example.</Paragraph>))
  test(`l("highlightCode")`, () => expectRender(l('highlightCode'), <>
    <Paragraph>code block:</Paragraph>
    <Code language="typescript">{`  const variable = "value";`}</Code>
    <Paragraph>this is and example.</Paragraph>
  </>))
})