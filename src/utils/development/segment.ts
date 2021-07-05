import isMobile from '../isMobile'

export type TrackContext = {
  wallet: boolean | string
  mobile: boolean
}

export type Tracker = (
  segment: SegmentAnalytics.AnalyticsJS,
  context: TrackContext
) => void

let context: TrackContext | null = null

export default function segment(tracker: Tracker) {
  if (window.analytics) {
    if (!context) {
      const ethereum = window?.ethereum as any
      context = {
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
    }

    tracker(window.analytics, context!)
  }
}
