import * as Sentry from '@sentry/browser'

export type SentryTracker = (sentry: typeof Sentry) => void

export default function sentry(tracker: SentryTracker) {
  if (typeof window !== 'undefined') {
    if ((window as any).Sentry) {
      tracker(Sentry)
    }
  }
}
