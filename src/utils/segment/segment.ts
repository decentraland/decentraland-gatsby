export type Tracker = (segment: SegmentAnalytics.AnalyticsJS) => void

export default function segment(tracker: Tracker) {
  if (window.analytics) {
    tracker(window.analytics)
  }
}