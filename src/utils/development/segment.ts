import { getMouseEventData, getMouseEventName, isMeta } from '../dom/events'
import { isBlankTarget, isLocalLink } from '../dom/links'
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

// Dynamic import to handle ESM compatibility
let analyticsUtils: any = null
export const getAnalyticsUtils = async () => {
  if (!analyticsUtils) {
    analyticsUtils = await import(
      'decentraland-dapps/dist/modules/analytics/utils'
    )
  }
  return analyticsUtils
}

const getContext = once(async (): Promise<TrackContext> => {
  const utils = await getAnalyticsUtils()
  const wallets = utils.getAllWallets()
  return {
    mobile: isMobile(),
    wallet: wallets.length === 0 ? 'none' : wallets.join(','),
  }
})

function getAnalytics(): SegmentAnalytics.AnalyticsJS | null {
  return typeof window !== 'undefined' && window.analytics
    ? window.analytics
    : null
}

export default function segment(tracker: Tracker, callback?: () => void) {
  const analytics = getAnalytics()
  if (analytics) {
    getContext().then((context) => {
      tracker(analytics, context, callback ?? emptyCallback)
    })
  } else if (callback) {
    Promise.resolve().then(() => callback())
  }
}

export function track(
  event: string,
  data: Record<string, any> = {},
  callback?: () => void
) {
  const analytics = getAnalytics()

  if (analytics) {
    getContext().then((context) => {
      analytics.track(event, { ...context, ...data }, callback)
    })
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
