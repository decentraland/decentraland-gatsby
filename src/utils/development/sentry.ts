import {
  Scope,
  captureException,
  captureMessage,
  onLoad,
  setExtra,
  withScope,
} from '@sentry/gatsby'

import type { Extra } from '@sentry/types'

export type Sentry = {
  error: (error: Error | string, extra?: Extra) => void
  configure: (config: any) => void
}
export type SentryTracker = (sentry: Sentry) => void

let _sentry: Sentry

onLoad(() => {
  _sentry = {
    error: (error: Error | string, extra?: Extra) => {
      withScope((scope: Scope) => {
        scope.setLevel('error')
        if (extra) scope.setExtra('extra', extra)

        if (error instanceof Error) captureException(error)
        else captureMessage(error)
      })
    },
    configure: (config: any) => {
      setExtra('configuration', config)
    },
  }
})

export default function sentry(tracker: SentryTracker) {
  if (_sentry) tracker(_sentry)
}
