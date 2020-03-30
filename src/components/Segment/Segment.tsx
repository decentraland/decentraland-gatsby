import React from "react"

export type SegmentProps = React.Props<HTMLScriptElement> &
  React.HTMLProps<HTMLScriptElement> & {
    analyticsKey?: string
    analyticsJS?: string
    trackPage?: boolean
  }

export default function Segment({
  analyticsKey,
  analyticsJS,
  trackPage,
  ...props
}: SegmentProps) {
  if (!analyticsKey) {
    console.warn(`skipping segment inject: key is missing'`)
    return null
  }

  return (
    <script
      {...props}
      dangerouslySetInnerHTML={{
        __html: `
(function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="${analyticsJS ||
          'https://segment.decentraland.org/v1/"+t+"/segment.min.js'}";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
analytics.load("${analyticsKey}"); ${(trackPage !== false &&
            "analytics.page();") ||
          ""}
}})();`,
      }}
    />
  )
}
