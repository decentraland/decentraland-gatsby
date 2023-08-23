import { DependencyList, useEffect } from 'react'

import segment from '../utils/development/segment'
import sentry from '../utils/development/sentry'

export default function useAsyncEffect(
  callback: () => Promise<void | (() => void)>,
  dependencies?: DependencyList
) {
  return useEffect(() => {
    const promise = callback().catch((err) => {
      console.error(`AsyncEffect error: `, err)
      sentry((tracker) =>
        tracker.error('AsyncEffect error: ' + err.message, err)
      )
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
