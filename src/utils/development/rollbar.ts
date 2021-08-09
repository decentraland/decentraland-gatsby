import type Rollbar from 'rollbar'

export type RollbarTracker = (rollbar: Rollbar) => void

export default function rollbar(tracker: RollbarTracker) {
  if (typeof window !== 'undefined') {
    if ((window as any).Rollbar) {
      tracker((window as any).Rollbar)
    }
  }
}
