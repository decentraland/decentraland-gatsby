import React from 'react'
import { storiesOf } from "@storybook/react";
import centered from '@storybook/addon-centered/react'
import Divider from '../Text/Divider';
import Title from '../Text/Title';
import SubTitle from '../Text/SubTitle';
import Code from '../Text/Code';
import { Container } from 'decentraland-ui/dist/components/Container/Container';
import Paragraph from '../Text/Paragraph';
import { Button } from 'decentraland-ui/dist/components/Button/Button';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import Input from './Input'

storiesOf('Input', module)
  .addDecorator(centered)
  .add('Input', () => {
    return <Container>
      <Divider />
      <Title><Code inline>Input</Code> component:  </Title>
      <Divider line />
      <SubTitle>Common attributes</SubTitle>
      <Paragraph secondary> <Code inline>placeholder</Code>, <Code inline>value</Code>, <Code inline>disabled</Code>   </Paragraph>
      <Input placeholder="with placeholder" defaultValue="" />{' '}
      <Input placeholder="with placeholder" defaultValue="with value" />{' '}
      <Input placeholder="disabled" defaultValue="" disabled />{' '}
      <Divider line />
      <SubTitle>Sizes</SubTitle>
      <Divider size="mini" />
      <div>
        <Input size="mini" placeholder="mini" /> {' '}
        <Input size="tiny" placeholder="tiny" /> {' '}
        <Input size="small" placeholder="small" /> {' '}
        <Input size="medium" placeholder="medium" /> {' '}
        <Input size="large" placeholder="large" /> {' '}
      </div>
      <Divider line />
      <SubTitle>With Buttons</SubTitle>
      <Paragraph>You can use this input with buttons there size are the same</Paragraph>
      <Divider size="mini" />
      <Grid stackable padded relaxed divided="vertically">
        <Grid.Row>
          <Grid.Column tablet="5">
            <Input size="mini" placeholder="mini" /> {' '}
            <Button size="mini" primary>mini</Button>
          </Grid.Column>
          <Grid.Column tablet="5">
            <Input size="mini" placeholder="mini" /> {' '}
            <Button size="mini" primary inverted>mini</Button>
          </Grid.Column>
          <Grid.Column tablet="5">
            <Input size="mini" placeholder="mini" /> {' '}
            <Button size="mini" basic>mini</Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column tablet="5">
            <Input size="tiny" placeholder="tiny" /> {' '}
            <Button size="tiny" primary>tiny</Button>
          </Grid.Column>
          <Grid.Column tablet="5">
            <Input size="tiny" placeholder="tiny" /> {' '}
            <Button size="tiny" primary inverted>tiny</Button>
          </Grid.Column>
          <Grid.Column tablet="5">
            <Input size="tiny" placeholder="tiny" /> {' '}
            <Button size="tiny" basic>tiny</Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column tablet="8">
            <Input size="small" placeholder="small" /> {' '}
            <Button size="small" primary>small</Button>
          </Grid.Column>
          <Grid.Column tablet="8">
            <Input size="small" placeholder="small" /> {' '}
            <Button size="small" primary inverted>small</Button>
          </Grid.Column>
          <Grid.Column tablet="8">
            <Input size="small" placeholder="small" /> {' '}
            <Button size="small" basic>small</Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column tablet="8">
            <Input size="medium" placeholder="medium" /> {' '}
            <Button size="medium" primary>medium</Button>
          </Grid.Column>
          <Grid.Column tablet="8">
            <Input size="medium" placeholder="medium" /> {' '}
            <Button size="medium" primary inverted>medium</Button>
          </Grid.Column>
          <Grid.Column tablet="8">
            <Input size="medium" placeholder="medium" /> {' '}
            <Button size="medium" basic>medium</Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column tablet="8">
            <Input size="large" placeholder="large" /> {' '}
            <Button size="large" primary>large</Button>
          </Grid.Column>
          <Grid.Column tablet="8">
            <Input size="large" placeholder="large" /> {' '}
            <Button size="large" primary inverted>large</Button>
          </Grid.Column>
          <Grid.Column tablet="8">
            <Input size="large" placeholder="large" /> {' '}
            <Button size="large" basic>large</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider />
    </Container>
  })