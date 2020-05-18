import React from 'react'
import { storiesOf } from "@storybook/react";
import centered from '@storybook/addon-centered/react'
import useProfile from './useProfile';
import useCountdown from './useCountdown';
import useResponsive from './useResponsive';
import useMobileDetector from './useMobileDetector';
import Code from '../components/Text/Code';
import Title from '../components/Text/Title';
import { Container } from 'decentraland-ui/dist/components/Container/Container';
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive'
import Paragraph from '../components/Text/Paragraph';
import Italic from '../components/Text/Italic';
import { Button } from 'decentraland-ui/dist/components/Button/Button';
import MainTitle from '../components/Text/MainTitle';
import Divider from '../components/Text/Divider';
import Link from '../components/Text/Link';
import getUserAgent from '../utils/getUserAgent';
import { Time } from '../components/Date/utils';

const launch = new Date(Date.parse('2020-02-20T00:00:00.000Z'))
const future = new Date(Date.now() + Time.Day + Time.Hour)
future.setMilliseconds(0)

storiesOf('Hooks', module)
  .addDecorator(centered)
  .add('useCountdown', () => {
    const completed = useCountdown(launch)
    const countdown = useCountdown(future)
    return <Container>
      <Divider />
      <MainTitle>Using Countdown Hook</MainTitle>
      <Paragraph secondary>The <Italic>countdown hook</Italic> update a countdown using a time interval.</Paragraph>
      <Code language="typescript">{`const countdown = useCountdown(until, each)`}</Code>
      <Divider size="small" />
      <Paragraph><Code inline>until: Date</Code> the finish of the countdown.</Paragraph>
      <Paragraph><Code inline>each: number = Time.Second</Code> update interval of the countdown.</Paragraph>
      <Divider size="small" />
      <Paragraph><Code inline>countdown: Object</Code></Paragraph>
      <Paragraph><Code inline>countdown.days: number (>=0)</Code> days until the countdown finish.</Paragraph>
      <Paragraph><Code inline>countdown.hours: number (>=0)</Code> hours until days decreases.</Paragraph>
      <Paragraph><Code inline>countdown.minutes: number (>=0)</Code> minutes until hours decreases.</Paragraph>
      <Paragraph><Code inline>countdown.seconds: number (>=0)</Code> seconds until minutes decreases.</Paragraph>
      <Paragraph><Code inline>countdown.milliseconds: number (>=0)</Code> milliseconds until seconds decreases.</Paragraph>
      <Paragraph><Code inline>countdown.time: number (>=0)</Code> milliseconds until the countdown finish.</Paragraph>
      <Divider size="small" />
      <Title>Live example:</Title>
      <Code note="completed" language="json">{JSON.stringify(completed, null, 2)}</Code>
      <Code note="active" language="json">{JSON.stringify(countdown, null, 2)}</Code>
      <Divider />
    </Container>

  })
  .add('useMobileDetector', () => {
    const mobile = useMobileDetector()
    const userAgent = getUserAgent()

    return <Container>
      <Divider />
      <MainTitle>Using mobile detector Hook</MainTitle>
      <Paragraph secondary>The <Italic>mobile detector hook</Italic> let you check if the current navigator is mobile using the user agent</Paragraph>
      <Code language="typescript">{`const mobile = useMobileDetector(initialValue)`}</Code>
      <Divider size="small" />
      <Paragraph><Code inline>mobile: boolean</Code> true when a mobile user agent was detected.</Paragraph>
      <Divider line />
      <Title>Live example:</Title>
      <Code language="json" note="current user agent:">{JSON.stringify(userAgent)}</Code>
      <Code language="json" note="mobile:">{JSON.stringify(mobile)}</Code>
    </Container>
  })
  .add('useProfile', () => {
    const [profile, actions] = useProfile()
    return <Container>
      <Divider />
      <MainTitle>Using Profile Hook</MainTitle>
      <Paragraph secondary>The <Italic>profile hook</Italic> let you check for a user session.</Paragraph>
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
  .add('useResponsive', () => {
    const responsive = useResponsive()
    return <Container>
      <Divider />
      <MainTitle>Using Responsive Hook</MainTitle>
      <Paragraph secondary>The <Italic>responsive hook</Italic> allow you to check when the size of the windows is between a range.</Paragraph>
      <Code language="typescript">{`const responsive = useResponsive()`}</Code>
      <Divider size="small" />
      <Paragraph><Code inline>{'responsive: ({ minWidth?: number, maxWith?: number }) => boolean'}</Code></Paragraph>
      <Divider size="small" />
      <Title>Live example:</Title>
      <Code language="typescript">{`responsive(Responsive.onlyMobile) // ${responsive(Responsive.onlyMobile)}`}</Code>
      <Code language="typescript">{`responsive(Responsive.onlyTablet) // ${responsive(Responsive.onlyTablet)}`}</Code>
      <Code language="typescript">{`responsive(Responsive.onlyComputer) // ${responsive(Responsive.onlyComputer)}`}</Code>
      <Divider size="small" />
      <Code language="typescript">{`responsive({ minWidth: Responsive.onlyMobile.minWidth }) // ${responsive({ minWidth: Responsive.onlyMobile.minWidth })}`}</Code>
      <Code language="typescript">{`responsive({ minWidth: Responsive.onlyTablet.minWidth }) // ${responsive({ minWidth: Responsive.onlyTablet.minWidth })}`}</Code>
      <Code language="typescript">{`responsive({ minWidth: Responsive.onlyComputer.minWidth }) // ${responsive({ minWidth: Responsive.onlyComputer.minWidth })}`}</Code>
      <Divider size="small" />
      <Code language="typescript">{`responsive({ maxWidth: Responsive.onlyMobile.maxWidth }) // ${responsive({ maxWidth: Responsive.onlyMobile.maxWidth })}`}</Code>
      <Code language="typescript">{`responsive({ maxWidth: Responsive.onlyTablet.maxWidth }) // ${responsive({ maxWidth: Responsive.onlyTablet.maxWidth })}`}</Code>
      <Code language="typescript">{`responsive({ maxWidth: Responsive.onlyComputer.maxWidth }) // ${responsive({ maxWidth: Responsive.onlyComputer.maxWidth })}`}</Code>
      <Divider />
    </Container>
  })
