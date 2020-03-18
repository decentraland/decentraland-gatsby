import React from 'react'
import { storiesOf } from "@storybook/react";
import centered from '@storybook/addon-centered/react'
import Divider from '../Text/Divider';
import ImgAvatar from './ImgAvatar'
import Title from '../Text/Title';
import SubTitle from '../Text/SubTitle';
import Code from '../Text/Code';
import { Container } from 'decentraland-ui/dist/components/Container/Container';
import Paragraph from '../Text/Paragraph';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid'
import { Button } from 'decentraland-ui/dist/components/Button/Button';

storiesOf('Profile', module)
  .addDecorator(centered)
  .add('ImgAvatar', () => {
    return <Container>
      <Divider />
      <Title><Code inline>ImgAvatar</Code> component:  </Title>
      <Paragraph secondary>Allow you to show an image for a profile</Paragraph>
      <Divider line />
      <SubTitle>Automatic colors</SubTitle>
      <Paragraph>Background colors are automatically defined using the address </Paragraph>
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0x0...' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0x1...' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0x2...' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0x3...' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0x4...' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0x5..' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0x6..' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0x7..' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0x8..' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0x9..' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0xa..' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0xb..' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0xc..' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0xd..' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0xe..' } as any} />
      <ImgAvatar style={{ marginRight: '1rem' }} profile={{ address: '0xf..' } as any} />
      <Divider line />
      <SubTitle>Sizes</SubTitle>
      <Paragraph>There are a few size you can use:</Paragraph>
      <Code language="typescript">
        {"'mini' | 'tiny' |  'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive' | 'full'"}
      </Code>
      <Divider size="mini" />
      <ImgAvatar style={{ marginRight: '1rem' }} size="mini" />
      <ImgAvatar style={{ marginRight: '1rem' }} size="tiny" />
      <ImgAvatar style={{ marginRight: '1rem' }} size="small" />
      <ImgAvatar style={{ marginRight: '1rem' }} size="medium" />
      <ImgAvatar style={{ marginRight: '1rem' }} size="large" />
      <ImgAvatar style={{ marginRight: '1rem' }} size="big" />
      <ImgAvatar style={{ marginRight: '1rem' }} size="huge" />
      <ImgAvatar style={{ marginRight: '1rem' }} size="massive" />
      <ImgAvatar style={{ marginRight: '1rem' }} size="full" />
      <Divider size="small" />
      <Paragraph>You can used beside <Code inline>Button</Code>s </Paragraph>
      <div>
        <ImgAvatar style={{}} size="mini" />
        <Button basic size="mini">mini button</Button>
        <ImgAvatar style={{ margin: '0 .5rem 0 2rem' }} size="mini" />
        <Button primary size="mini">mini button</Button>
        <ImgAvatar style={{ margin: '0 .5rem 0 2rem' }} size="mini" />
        <Button inverted primary size="mini">mini button</Button>
      </div>
      <Divider size="tiny" />
      <div>
        <ImgAvatar style={{}} size="tiny" />
        <Button basic size="tiny">tiny button</Button>
        <ImgAvatar style={{ margin: '0 .5rem 0 2rem' }} size="tiny" />
        <Button primary size="tiny">tiny button</Button>
        <ImgAvatar style={{ margin: '0 .5rem 0 2rem' }} size="tiny" />
        <Button inverted primary size="tiny">tiny button</Button>
      </div>
      <Divider size="tiny" />
      <div>
        <ImgAvatar style={{}} size="small" />
        <Button basic size="small">small button</Button>
        <ImgAvatar style={{ margin: '0 .5rem 0 2rem' }} size="small" />
        <Button primary size="small">small button</Button>
        <ImgAvatar style={{ margin: '0 .5rem 0 2rem' }} size="small" />
        <Button inverted primary size="small">small button</Button>
      </div>
      <Divider size="tiny" />
      <div>
        <ImgAvatar style={{}} size="medium" />
        <Button basic size="medium">medium button</Button>
        <ImgAvatar style={{ margin: '0 .5rem 0 2rem' }} size="medium" />
        <Button primary size="medium">medium button</Button>
        <ImgAvatar style={{ margin: '0 .5rem 0 2rem' }} size="medium" />
        <Button inverted primary size="medium">medium button</Button>
      </div>
      <Divider size="tiny" />
      <div>
        <ImgAvatar style={{}} size="large" />
        <Button basic size="large">large button</Button>
        <ImgAvatar style={{ margin: '0 .5rem 0 2rem' }} size="large" />
        <Button primary size="large">large button</Button>
        <ImgAvatar style={{ margin: '0 .5rem 0 2rem' }} size="large" />
        <Button inverted primary size="large">large button</Button>
      </div>
      <Divider />
    </Container>
  })