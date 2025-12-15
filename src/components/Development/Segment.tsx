import React from 'react'

import env from '../../utils/env'

export type SegmentProps = React.Props<HTMLScriptElement> &
  React.HTMLProps<HTMLScriptElement> & {
    /** @deprecated use segmentKey instead */
    analyticsKey?: string
    /** Segment key */
    segmentKey?: string
    /** Track the first time the page load */
    trackPage?: boolean
  }

export default React.memo(function Segment({
  analyticsKey,
  segmentKey,
  trackPage,
  ...props
}: SegmentProps) {
  segmentKey = segmentKey || analyticsKey || env('SEGMENT_KEY', '')
  if (!segmentKey) {
    console.warn(
      `skipping segment inject: segmentKey and GATSBY_SEGMENT_KEY is missing'`
    )
    return null
  }

  return (
    <>
      {/* Segment initialization script - without dynamic load function */}
      <script
        {...props}
        dangerouslySetInnerHTML={{
          __html: `
!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics._writeKey="${segmentKey}";;analytics.SNIPPET_VERSION="4.15.3";
${(trackPage && 'analytics.page();') || ''}
}}();`,
        }}
      />
      {/* Segment script loaded directly in static HTML */}
      <script
        key="segment-cdn"
        async
        src={`https://cdn.segment.com/analytics.js/v1/${segmentKey}/analytics.min.js`}
      />
    </>
  )
})
