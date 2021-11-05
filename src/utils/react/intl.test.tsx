import React from 'react'
import ReactDOM from 'react-dom/server'
import { createIntl } from 'react-intl'
import { createFormatMessage } from './intl'
import flat from 'flat'
import Paragraph from '../../components/Text/Paragraph'
import Italic from '../../components/Text/Italic'
import Bold from '../../components/Text/Bold'
import Link from '../../components/Text/Link'
import Code from '../../components/Text/Code'

describe(__filename, () => {
  const intl = createIntl({
    locale: 'en',
    messages: flat({
      empty: '',
      paragraph: '1rt paragraph: regular message with data: {value}.',
      decorations:
        '2nd paragraph: *italic*, **bold**, [innerLink](#) and [outerLink](https://decentraland.com).',
      breakLine: '1rt paragraph\n\n2nd paragraph.',
      list: [
        { text: 'item 1 ({index}, {isFirst}, {isLast}).' },
        { text: 'item 2 ({index}, {isFirst}, {isLast}).' },
        { text: 'item 3 ({index}, {isFirst}, {isLast}).' },
      ],
      code: 'code block:\n\n```\n  const variable = "value";\n```\n\nthis is and example.',
      inlineCode: 'inline `code` example.',
      highlightCode:
        'code block:\n\n```typescript\n  const variable = "value";\n```\n\nthis is and example.',
    }),
  })

  const l = createFormatMessage(intl)
  test(`l.isEmpty("invalid")`, () => expect(l.isEmpty('invalid')).toBe(true))
  test(`l.isEmpty("empty")`, () => expect(l.isEmpty('empty')).toBe(true))
  test(`l.isEmpty("paragraph")`, () =>
    expect(l.isEmpty('paragraph')).toBe(false))

  test(`l.str("invalid")`, () => expect(l('invalid')).toBe(null))
  test(`l.str("empty")`, () => expect(l('empty')).toBe(null))
  test(`l.str("paragraph")`, () =>
    expect(l('paragraph', { value: 2 })).toBe(
      '1rt paragraph: regular message with data: 2.'
    ))

  function expectRender(
    element: JSX.Element[] | JSX.Element | null,
    toBe: JSX.Element | null
  ) {
    return expect(
      element && ReactDOM.renderToStaticMarkup(<>{element}</>)
    ).toBe(toBe && ReactDOM.renderToStaticMarkup(toBe))
  }

  test(`l("invalid")`, () => expectRender(l.markdown('invalid'), null))
  test(`l("empty")`, () => expectRender(l.markdown('empty'), null))
  test(`l("paragraph")`, () =>
    expectRender(
      l.markdown('paragraph', { value: 1 }),
      <Paragraph>1rt paragraph: regular message with data: 1.</Paragraph>
    ))
  test(`l("decorations")`, () =>
    expectRender(
      l.markdown('decorations'),
      <Paragraph>
        2nd paragraph: <Italic>italic</Italic>, <Bold>bold</Bold>,{' '}
        <Link href="#" target="">
          innerLink
        </Link>{' '}
        and{' '}
        <Link href="https://decentraland.com" target="_blank">
          outerLink
        </Link>
        .
      </Paragraph>
    ))
  test(`l("breakLine")`, () =>
    expectRender(
      l.markdown('breakLine'),
      <>
        <Paragraph>1rt paragraph</Paragraph>
        <Paragraph>2nd paragraph.</Paragraph>
      </>
    ))
  test(`l("code")`, () =>
    expectRender(
      l.markdown('code'),
      <>
        <Paragraph>code block:</Paragraph>
        <Code>{`  const variable = "value";`}</Code>
        <Paragraph>this is and example.</Paragraph>
      </>
    ))
  test(`l("inlineCode")`, () =>
    expectRender(
      l.markdown('inlineCode'),
      <Paragraph>
        inline <Code inline>code</Code> example.
      </Paragraph>
    ))
  test(`l("highlightCode")`, () =>
    expectRender(
      l.markdown('highlightCode'),
      <>
        <Paragraph>code block:</Paragraph>
        <Code language="typescript">{`  const variable = "value";`}</Code>
        <Paragraph>this is and example.</Paragraph>
      </>
    ))
})
