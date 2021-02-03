import React from 'react'
import { storiesOf } from "@storybook/react";
import centered from '@storybook/addon-centered/react'
import Divider from '../Text/Divider';
import Avatar from './Avatar'
import Title from '../Text/Title';
import SubTitle from '../Text/SubTitle';
import Code from '../Text/Code';
import { Container } from 'decentraland-ui/dist/components/Container/Container';
import Paragraph from '../Text/Paragraph';
import { Button } from 'decentraland-ui/dist/components/Button/Button';

storiesOf('Profile', module)
  .addDecorator(centered)
  .add('Avatar', () => {
    return <Container>
      <Divider />
      <Title><Code inline>Avatar</Code> component:  </Title>
      <Paragraph secondary>Allow you to show an image for a profile</Paragraph>
      <Divider line />
      <SubTitle>Automatic colors</SubTitle>
      <Paragraph>Background colors are automatically defined using the address </Paragraph>
      <Avatar style={{ marginRight: '1rem' }} address={'0x0...'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0x1...'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0x2...'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0x3...'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0x4...'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0x5..'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0x6..'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0x7..'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0x8..'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0x9..'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0xa..'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0xb..'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0xc..'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0xd..'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0xe..'} />
      <Avatar style={{ marginRight: '1rem' }} address={'0xf..'} />
      <Divider line />
      <SubTitle>Sizes</SubTitle>
      <Paragraph>There are a few size you can use:</Paragraph>
      <Code language="typescript">
        {"'mini' | 'tiny' |  'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive' | 'full'"}
      </Code>
      <Divider size="mini" />
      <Avatar style={{ marginRight: '1rem' }} size="mini" />
      <Avatar style={{ marginRight: '1rem' }} size="tiny" />
      <Avatar style={{ marginRight: '1rem' }} size="small" />
      <Avatar style={{ marginRight: '1rem' }} size="medium" />
      <Avatar style={{ marginRight: '1rem' }} size="large" />
      <Avatar style={{ marginRight: '1rem' }} size="big" />
      <Avatar style={{ marginRight: '1rem' }} size="huge" />
      <Avatar style={{ marginRight: '1rem' }} size="massive" />
      <Avatar style={{ marginRight: '1rem' }} size="full" />
      <Divider size="small" />
      <Paragraph>You can used beside <Code inline>Button</Code>s </Paragraph>
      <div>
        <Avatar style={{}} size="mini" />
        <Button basic size="mini">mini button</Button>
        <Avatar style={{ margin: '0 .5rem 0 2rem' }} size="mini" />
        <Button primary size="mini">mini button</Button>
        <Avatar style={{ margin: '0 .5rem 0 2rem' }} size="mini" />
        <Button inverted primary size="mini">mini button</Button>
      </div>
      <Divider size="tiny" />
      <div>
        <Avatar style={{}} size="tiny" />
        <Button basic size="tiny">tiny button</Button>
        <Avatar style={{ margin: '0 .5rem 0 2rem' }} size="tiny" />
        <Button primary size="tiny">tiny button</Button>
        <Avatar style={{ margin: '0 .5rem 0 2rem' }} size="tiny" />
        <Button inverted primary size="tiny">tiny button</Button>
      </div>
      <Divider size="tiny" />
      <div>
        <Avatar style={{}} size="small" />
        <Button basic size="small">small button</Button>
        <Avatar style={{ margin: '0 .5rem 0 2rem' }} size="small" />
        <Button primary size="small">small button</Button>
        <Avatar style={{ margin: '0 .5rem 0 2rem' }} size="small" />
        <Button inverted primary size="small">small button</Button>
      </div>
      <Divider size="tiny" />
      <div>
        <Avatar style={{}} size="medium" />
        <Button basic size="medium">medium button</Button>
        <Avatar style={{ margin: '0 .5rem 0 2rem' }} size="medium" />
        <Button primary size="medium">medium button</Button>
        <Avatar style={{ margin: '0 .5rem 0 2rem' }} size="medium" />
        <Button inverted primary size="medium">medium button</Button>
      </div>
      <Divider size="tiny" />
      <div>
        <Avatar style={{}} size="large" />
        <Button basic size="large">large button</Button>
        <Avatar style={{ margin: '0 .5rem 0 2rem' }} size="large" />
        <Button primary size="large">large button</Button>
        <Avatar style={{ margin: '0 .5rem 0 2rem' }} size="large" />
        <Button inverted primary size="large">large button</Button>
      </div>
      <Divider />
    </Container>
  })