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

  return intercomSettings.app_id ? (
    <script
      {...props}
      id="__dgatsby_intercom__"
      data-settings={JSON.stringify(intercomSettings)}
      dangerouslySetInnerHTML={{
        __html: [
          `(function(){var w=window;var stt=JSON.parse(document.getElementById("__dgatsby_intercom__").dataset.settings);window.intercomSettings=stt;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',s);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/'+stt.app_id;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`,
        ].join('\n'),
      }}
    />
  ) : null
})
