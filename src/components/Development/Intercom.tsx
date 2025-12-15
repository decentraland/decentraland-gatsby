import React from 'react'

import env from '../../utils/env'

export type IntercomProps = {
  appId?: string
  apiBase?: IntercomApiBase
}

export enum IntercomApiBase {
  US = 'https://api-iam.intercom.io',
  EU = 'https://api-iam.eu.intercom.io',
  Australia = 'https://api-iam.au.intercom.io',
}

export default React.memo(function Intercom(props: IntercomProps) {
  const intercomSettings = {
    app_id: props.appId ?? env('INTERCOM_APP_ID'),
    api_base: props.apiBase ?? IntercomApiBase.US,
  }

  if (!intercomSettings.app_id) {
    return null
  }

  return (
    <>
      {/* Intercom initialization script - without dynamic load function */}
      <script
        {...props}
        id="__dgatsby_intercom__"
        data-settings={JSON.stringify(intercomSettings)}
        dangerouslySetInnerHTML={{
          __html: `(function(){var w=window;var stt=JSON.parse(document.getElementById("__dgatsby_intercom__").dataset.settings);window.intercomSettings=stt;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',stt);}else{var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;}})();`,
        }}
      />
      {/* Intercom script loaded directly in static HTML */}
      <script
        key="intercom-widget"
        async
        src={`https://widget.intercom.io/widget/${intercomSettings.app_id}`}
      />
    </>
  )
})
