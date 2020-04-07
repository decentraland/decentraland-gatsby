import React from 'react'
import { storiesOf } from "@storybook/react";
import centered from '@storybook/addon-centered/react'
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid'
import Divider from '../Text/Divider';
import ImgFixed from './ImgFixed'
import Title from '../Text/Title';
import Code from '../Text/Code';
import { Container } from 'decentraland-ui/dist/components/Container/Container';
import Paragraph from '../Text/Paragraph';
import SubTitle from '../Text/SubTitle';

storiesOf('Images', module)
  .addDecorator(centered)
  .add('ImgAvatar', () => {
    return <Container>
      <Divider />
      <Title><Code inline>ImgFixed</Code> component:  </Title>
      <Paragraph secondary>Allow you insert an image with a constant relation between width and height</Paragraph>
      <Divider size="small" />
      <Grid>
        <Grid.Row>
          <Grid.Column mobile="5">
            <SubTitle>Wide</SubTitle>
            <ImgFixed dimension="wide" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
          </Grid.Column>
          <Grid.Column mobile="5">
            <SubTitle>Square</SubTitle>
            <ImgFixed dimension="square" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
          </Grid.Column>
          <Grid.Column mobile="5">
            <SubTitle>Vertical</SubTitle>
            <ImgFixed dimension="vertical" src="https://user-images.githubusercontent.com/2781777/40743488-0927f342-6428-11e8-942d-3ca36269d7dc.png" />
          </Grid.Column>
        </Grid.Row >
      </Grid >
      <Divider />
    </Container >
  })