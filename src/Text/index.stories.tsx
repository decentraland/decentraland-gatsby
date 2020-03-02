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

storiesOf('Text', module)
  .add('Details', () => (<>
    <Container>
      <MainTitle>A Main Title (only one per page)</MainTitle>
      <Title>A Title</Title>
      <SubTitle>A sub title</SubTitle>
      <Paragraph>1st paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Paragraph>
      <Paragraph>2nd paragraph: <Italic>italic</Italic>, <Underline>underline</Underline>, <Bold>bold</Bold>, and <Link href="#">hyperlink</Link>.</Paragraph>
    </Container>
  </>))