export type Tracker = (segment: SegmentAnalytics.AnalyticsJS) => void

export default function track(tracker: Tracker) {
  if (window.analytics) {
    tracker(window.analytics)
  }
}