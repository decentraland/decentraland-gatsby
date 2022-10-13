import Analytics from 'analytics-node'
import { yellow } from 'colors/safe'

import env from '../../utils/env'
import { LoggerSubscription } from './logger'

export default function createSegmentSubscriber(): LoggerSubscription {
  const segmentKey = env('SEGMENT') || env('SEGMENT_KEY')
  if (!segmentKey) {
    console.log(
      `missing`,
      yellow('GATSBY_SEGMENT'),
      ' or ',
      yellow('GATSBY_SEGMENT_KEY')
    )
    return () => {}
  }

  const analytics = new Analytics(segmentKey)
  return (message, data) => {
    analytics.track({ event: data.level, properties: { ...data, message } })
  }
}
