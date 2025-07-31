import { getMouseEventData, getMouseEventName, isMeta } from '../dom/events'
import { isBlankTarget, isLocalLink } from '../dom/links'
import once from '../function/once'
import isMobile from '../isMobile'

export type TrackContext = {
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

const getContext = once((): TrackContext => {
  return {
    mobile: isMobile(),
  }
})

async function getAnalytics(): Promise<SegmentAnalytics.AnalyticsJS | null> {
  const utils = await getAnalyticsUtils()
  return utils.getAnalytics()
}

export default function segment(tracker: Tracker, callback?: () => void) {
  if (typeof window !== 'undefined' && window.analytics) {
    getAnalytics().then((analytics) => {
      if (analytics) {
        const context = getContext()
        tracker(analytics, context, callback ?? emptyCallback)
      } else if (callback) {
        Promise.resolve().then(() => callback())
      }
    })
  }
}

export function track(
  event: string,
  data: Record<string, any> = {},
  callback?: () => void
) {
  if (typeof window !== 'undefined' && window.analytics) {
    getAnalytics().then((analytics) => {
      if (analytics) {
        const context = getContext()
        analytics.track(event, { ...context, ...data }, callback)
      } else if (callback) {
        Promise.resolve().then(() => callback())
      }
    })
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
