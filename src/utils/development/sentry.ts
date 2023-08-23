import * as Sentry from '@sentry/browser'

export type SentryTracker = (rollbar: typeof Sentry) => void

export default function rollbar(tracker: SentryTracker) {
  if (typeof window !== 'undefined') {
    if ((window as any).__SENTRY__) {
      tracker(Sentry)
    }
  }
}
