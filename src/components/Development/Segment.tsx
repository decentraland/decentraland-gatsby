import React from 'react'

export type SegmentProps = React.Props<HTMLScriptElement> &
  React.HTMLProps<HTMLScriptElement> & {
    /** @deprecated use segmentKey instead */
    analyticsKey?: string
    /** @deprecated use src instead */
    analyticsJS?: string
    /** Segment key */
    segmentKey?: string
    /** @deprecated Alternative source */
    src?: string
    /** Alternative source */
    trackPage?: boolean
  }

export default React.memo(function Segment({
  analyticsKey,
  analyticsJS,
  segmentKey,
  src,
  trackPage,
  ...props
}: SegmentProps) {
  segmentKey = segmentKey || analyticsKey || process.env.GATSBY_SEGMENT_KEY
  if (!segmentKey) {
    console.warn(
      `skipping segment inject: segmentKey and GATSBY_SEGMENT_KEY is missing'`
    )
    return null
  }

  return (
    <script
      {...props}
      dangerouslySetInnerHTML={{
        __html: `
        !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${segmentKey}";;analytics.SNIPPET_VERSION="4.15.3";
        analytics.load("${segmentKey}");
        ${trackPage ? 'analytics.page();' : ''}
        }}();
      `,
      }}
    />
  )
})
