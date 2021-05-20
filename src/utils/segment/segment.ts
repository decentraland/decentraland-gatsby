import isMobile from "../isMobile"

export type TrackContext = {
  wallet: boolean | string,
  mobile: boolean
}

export type Tracker = (segment: SegmentAnalytics.AnalyticsJS, context: TrackContext) => void

let context: TrackContext | null = null

export default function segment(tracker: Tracker) {
  if (window.analytics) {
    if (!context) {
      context = {
        mobile: isMobile(),
        wallet: (
          (window?.ethereum as any)?.isMetaMask ? 'metamask' :
          (window?.ethereum as any)?.isDapper ? 'dapper' :
          (window?.ethereum as any)?.isCucumber ? 'cucumber' :
          (window?.ethereum as any)?.isTrust ? 'trust' :
          (window?.ethereum as any)?.isToshi ? 'coinbase' :
          (window?.ethereum as any)?.isGoWallet ? 'goWallet' :
          (window?.ethereum as any)?.isAlphaWallet ? 'alphaWallet' :
          (window?.ethereum as any)?.isStatus ? 'status' :
          (window?.ethereum as any) ? 'other' :
          false
        )
      }
    }

    tracker(window.analytics, context!)
  }
}