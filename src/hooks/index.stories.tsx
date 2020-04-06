import React from 'react'
import { storiesOf } from "@storybook/react";
import centered from '@storybook/addon-centered/react'
import useProfile from './useProfile';
import Code from '../components/Text/Code';
import Title from '../components/Text/Title';
import { Container } from 'decentraland-ui/dist/components/Container/Container';
import Paragraph from '../components/Text/Paragraph';
import Italic from '../components/Text/Italic';
import { Button } from 'decentraland-ui/dist/components/Button/Button';
import MainTitle from '../components/Text/MainTitle';
import Divider from '../components/Text/Divider';
import Link from '../components/Text/Link';

storiesOf('Hooks', module)
  .addDecorator(centered)
  .add('useProfile', () => {
    const [profile, actions] = useProfile()
    return <Container>
      <Divider />
      <MainTitle>Using the Profile Hook</MainTitle>
      <Paragraph secondary>The <Italic>Profile Hook</Italic> let you check for a user session</Paragraph>
      <Code language="typescript">{`const [profile, actions] = useProfile()`}</Code>
      <Divider size="small" />
      <Paragraph><Code inline>profile: Object | null</Code> contains all the the information about the current session.</Paragraph>
      <Paragraph><Code inline>profile.address: Address</Code> ethereum address used to create the session.</Paragraph>
      <Paragraph><Code inline>profile.identity: Object</Code> session representation created with <Link href="https://github.com/decentraland/decentraland-crypto">decentraland-crypto</Link>.</Paragraph>
      <Paragraph><Code inline>profile.avatar: Object | null</Code> avatar information from Katalyst server, could be null if the address doesn't have an avatar.</Paragraph>
      <Divider size="small" />
      <Paragraph><Code inline>actions: Object</Code> contains method to create or destroy sessions.</Paragraph>
      <Paragraph><Code inline>{`actions.loading: boolean`}</Code> true when the session is loading.</Paragraph>
      <Paragraph><Code inline>{`actions.provider: boolean`}</Code> true a eth provider was detected.</Paragraph>
      <Paragraph><Code inline>{`actions.error: Error & { code: string }`}</Code> Last connection error.</Paragraph>
      <Paragraph><Code inline>{`actions.connect: () => Promise<Profile>`}</Code> asks to the user to sign a new session.</Paragraph>
      <Paragraph><Code inline>{`actions.disconnect: () => Promise<null>`}</Code> destroys the current session if there is one.</Paragraph>
      {/* <ConnectButton basic size="small" {...actions()} /> */}
      <Divider line />
      <Title>Live example:</Title>
      <Paragraph> Call actions and see the current value of <Code inline>profile</Code> and <Code inline>loading</Code></Paragraph>
      <Button primary size="small" loading={actions.loading} disabled={actions.provider && !!profile} onClick={() => actions.connect()}>connect</Button>
      <Button primary size="small" loading={actions.loading} disabled={actions.provider && !profile} onClick={() => actions.disconnect()}>disconnect</Button>
      {/* <ConnectButton basic size="small" i18n={{ connect: `actions.connect()`, disconnect: 'actions.disconnect()' }} /> */}
      <Code language="json" note="actions:">{JSON.stringify({
        loading: actions.loading,
        provider: actions.provider,
        error: actions.error && {
          name: actions.error.name,
          code: actions.error.code,
          message: actions.error.message,
          stack: actions.error.stack,
        },
      }, null, 2)}</Code>
      <Code language="json" note="profile:">{JSON.stringify(profile, null, 2)}</Code>
    </Container>
  })