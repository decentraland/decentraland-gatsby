import { DependencyList, useEffect } from 'react'

import rollbar from '../utils/development/rollbar'
import segment from '../utils/development/segment'
import sentry from '../utils/development/sentry'

export default function useAsyncEffect(
  callback: () => Promise<void | (() => void)>,
  dependencies?: DependencyList
) {
  return useEffect(() => {
    const promise = callback().catch((err) => {
      console.error(`AsyncEffect error: `, err)
      rollbar((rollbar) =>
        rollbar.error('AsyncEffect error: ' + err.message, err)
      )
      sentry((sentry) => {
        sentry.setExtra('error', err)
        sentry.captureMessage('AsyncEffect error: ' + err.message)
      })
      segment((analytics) =>
        analytics.track('error', {
          ...err,
          message: err.message,
          stack: err.stack,
        })
      )
    })

    return function () {
      promise.then((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      })
    }
  }, dependencies)
}
