import React from 'react'
import { Container } from 'decentraland-ui/dist/components/Container/Container'
import { storiesOf } from '@storybook/react'
import Paragraph from './Paragraph'
import Title from './Title'
import SubTitle from './SubTitle'
import Bold from './Bold'
import Link from './Link'
import Italic from './Italic'
import Underline from './Underline'
import MainTitle from './MainTitle'
import Divider from './Divider'
import Code from './Code'
import Markdown from './Markdown'

storiesOf('Text', module)
  .add('Details', () => (<>
    <Container>
      <Divider />
      <MainTitle>A Main Title (only one per page)</MainTitle>
      <Title>A Title</Title>
      <SubTitle>A sub title</SubTitle>
      <Paragraph>
        1st paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
        enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
        in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
        anim id est laborum.
      </Paragraph>
      <Paragraph>2nd paragraph: <Italic>italic</Italic>, <Underline>underline</Underline>, <Bold>bold</Bold>, <Code inline>code</Code>, and <Link href="#">hyperlink</Link>.</Paragraph>
      <Code>
        {[
          '3rd paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
          'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut',
          'enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi',
          'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit',
          'in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint',
          'occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit',
          'anim id est laborum.',
        ].join('\n')}
      </Code>
      <Code language="typescript" note="highlight code:">
        const langauge = {JSON.stringify([
        '1c',
        'abnf',
        'accesslog',
        'actionscript',
        'ada',
        'angelscript',
        'apache',
        'applescript',
        'arcade',
        'arduino',
        'armasm',
        'asciidoc',
        'aspectj',
        'autohotkey',
        'autoit',
        'avrasm',
        'awk',
        'axapta',
        'bash',
        'basic',
        'bnf',
        'brainfuck',
        'cal',
        'capnproto',
        'ceylon',
        'clean',
        'clojure',
        'clojure',
        'cmake',
        'coffeescript',
        'coq',
        'cos',
        'cpp',
        'crmsh',
        'crystal',
        'cs',
        'csp',
        'css',
        'd',
        'dart',
        'delphi',
        'diff',
        'django',
        'dns',
        'dockerfile',
        'dos',
        'dsconfig',
        'dts',
        'dust',
        'ebnf',
        'elixir',
        'elm',
        'erb',
        'erlang',
        'erlang',
        'excel',
        'fix',
        'flix',
        'fortran',
        'fsharp',
        'gams',
        'gauss',
        'gcode',
        'gherkin',
        'glsl',
        'gml',
        'go',
        'golo',
        'gradle',
        'groovy',
        'haml',
        'handlebars',
        'haskell',
        'haxe',
        'hsp',
        'htmlbars',
        'http',
        'hy',
        'inform7',
        'ini',
        'irpf90',
        'isbl',
        'java',
        'javascript',
        'jboss',
        'json',
        'julia',
        'julia',
        'kotlin',
        'lasso',
        'ldif',
        'leaf',
        'less',
        'lisp',
        'livecodeserver',
        'livescript',
        'llvm',
        'lsl',
        'lua',
        'makefile',
        'markdown',
        'mathematica',
        'matlab',
        'maxima',
        'mel',
        'mercury',
        'mipsasm',
        'mizar',
        'mojolicious',
        'monkey',
        'moonscript',
        'n1ql',
        'nginx',
        'nimrod',
        'nix',
        'nsis',
        'objectivec',
        'ocaml',
        'openscad',
        'oxygene',
        'parser3',
        'perl',
        'pf',
        'pgsql',
        'php',
        'plaintext',
        'pony',
        'powershell',
        'processing',
        'profile',
        'prolog',
        'properties',
        'protobuf',
        'puppet',
        'purebasic',
        'python',
        'q',
        'qml',
        'r',
        'reasonml',
        'rib',
        'roboconf',
        'routeros',
        'rsl',
        'ruby',
        'ruleslanguage',
        'rust',
        'sas',
        'scala',
        'scheme',
        'scilab',
        'scss',
        'shell',
        'smali',
        'smalltalk',
        'sml',
        'sqf',
        'sql',
        'stan',
        'stata',
        'step21',
        'stylus',
        'subunit',
        'swift',
        'taggerscript',
        'tap',
        'tcl',
        'tex',
        'thrift',
        'tp',
        'twig',
        'typescript',
        'vala',
        'vbnet',
        'vbscript',
        'vbscript',
        'verilog',
        'vhdl',
        'vim',
        'x86asm',
        'xl',
        'xml',
        'xquery',
        'yaml',
        'zephir',
      ], null, 2)}
      </Code>
      <Divider />
    </Container>
  </>))
  .add('Markdown', () => (<Container><Markdown source={
    `
# Welcome to my React Markdown Editor!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`< div ></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ |: -------------: | -------------:
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
      - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want!
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
    `
  } /></Container >))