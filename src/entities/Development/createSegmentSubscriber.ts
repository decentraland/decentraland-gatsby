import Analytics from 'analytics-node'
import chalk from 'chalk'

import { LoggerSubscription } from './logger'
import env from '../../utils/env'

export default function createSegmentSubscriber(): LoggerSubscription {
  const segmentKey = env('SEGMENT') || env('SEGMENT_KEY')
  if (!segmentKey) {
    console.log(
      `missing`,
      chalk.yellow('GATSBY_SEGMENT'),
      ' or ',
      chalk.yellow('GATSBY_SEGMENT_KEY')
    )
    return () => {}
  }

  const analytics = new Analytics(segmentKey)
  return (message, data) => {
    analytics.track({
      anonymousId: 'server',
      event: data.level,
      properties: { ...data, message },
    })
  }
}
