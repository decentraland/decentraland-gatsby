import React from 'react'

import env from '../../utils/env'

declare interface Window {
  Intercom?: (
    action: 'boot' | 'update',
    props?: Record<string, string | number>
  ) => void
}

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

  return intercomSettings.app_id ? (
    <script
      {...props}
      dangerouslySetInnerHTML={{
        __html: [
          `(function(){ window.intercomSettings = ${JSON.stringify(
            intercomSettings
          )}; })();`,
          `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${intercomSettings.app_id}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`,
        ].join('\n'),
      }}
    />
  ) : null
})
