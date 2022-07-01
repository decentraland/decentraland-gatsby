import { isBlankTarget, isLocalLink } from '../../components/Text/Link'
import { getMouseEventData, getMouseEventName, isMeta } from '../dom/events'
import once from '../function/once'
import isMobile from '../isMobile'

export type TrackContext = {
  wallet: boolean | string
  mobile: boolean
}

export type Tracker = (
  segment: SegmentAnalytics.AnalyticsJS,
  context: TrackContext,
  callback: () => void
) => void

const emptyCallback = () => {}
const getContext = once((): TrackContext => {
  const ethereum = window?.ethereum as any
  return {
    mobile: isMobile(),
    wallet: !ethereum
      ? 'none'
      : ethereum?.isMetaMask
      ? 'metamask'
      : ethereum?.isDapper
      ? 'dapper'
      : ethereum?.isCucumber
      ? 'cucumber'
      : ethereum?.isTrust
      ? 'trust'
      : ethereum?.isToshi
      ? 'coinbase'
      : ethereum?.isGoWallet
      ? 'goWallet'
      : ethereum?.isAlphaWallet
      ? 'alphaWallet'
      : ethereum?.isStatus
      ? 'status'
      : 'other',
  }
})

export default function segment(tracker: Tracker, callback?: () => void) {
  if (typeof window !== 'undefined' && window.analytics) {
    tracker(window.analytics, getContext(), callback ?? emptyCallback)
  } else if (callback) {
    Promise.resolve().then(() => callback())
  }
}

export function track(
  event: string,
  data: Record<string, any> = {},
  callback?: () => void
) {
  if (typeof window !== 'undefined' && window.analytics) {
    const analytics = window.analytics
    analytics.track(event, { ...getContext(), ...data }, callback)
  } else if (callback) {
    Promise.resolve().then(() => callback())
  }
}

/** @deprecated use useTrackLinkContext instead */
export function createTrackLinkHandler<
  T extends (event: React.MouseEvent<any>, ...extra: any[]) => void
>(callback: T): T {
  return ((event: React.MouseEvent<any>, ...extra: any[]) => {
    const name = getMouseEventName(event)
    const data = getMouseEventData(event)

    callback(event, ...extra)
    let trackCallback = emptyCallback
    if (
      !isLocalLink(data.href) &&
      !isBlankTarget(data.target) &&
      !isMeta(event) &&
      !event.defaultPrevented
    ) {
      event.preventDefault()
      trackCallback = () => {
        window.location.href = data.href!
      }
    }

    track(name, data, trackCallback)
  }) as T
}
