import React from 'react'

import env from '../../utils/env'

import type { BrowserOptions } from '@sentry/browser'

type SentryProps = {
  src?: string
} & React.ScriptHTMLAttributes<HTMLScriptElement> &
  React.HTMLProps<HTMLScriptElement>

export default React.memo(function Sentry({ src, ...props }: SentryProps) {
  src = src || env('SENTRY_SRC', process.env.GATSBY_SENTRY_SRC || '')

  if (!src) {
    console.warn(
      `skipping Sentry init inject: src and GATSBY_SENTRY_SRC is missing'`
    )
    return null
  }

  const commitInfo: Record<string, string | number> = {}

  const COMMIT_SHA = env('COMMIT_SHA')
  if (COMMIT_SHA !== undefined) {
    commitInfo['commit.sha'] = COMMIT_SHA
  }

  const COMMIT_SHORT_SHA = env('COMMIT_SHORT_SHA')
  if (COMMIT_SHORT_SHA !== undefined) {
    commitInfo['commit.short_sha'] = COMMIT_SHORT_SHA
  }

  const COMMIT_REF_NAME = env('COMMIT_REF_NAME')
  if (COMMIT_REF_NAME !== undefined) {
    commitInfo['commit.ref_name'] = COMMIT_REF_NAME
  }

  const COMMIT_BRANCH = env('COMMIT_BRANCH')
  if (COMMIT_BRANCH !== undefined) {
    commitInfo['commit.branch'] = COMMIT_BRANCH
  }

  const COMMIT_TAG = env('COMMIT_TAG')
  if (COMMIT_TAG !== undefined) {
    commitInfo['commit.tag'] = COMMIT_TAG
  }

  const sentrySettings: BrowserOptions = {
    environment: env('ENVIRONMENT', 'local'),
    // Performance Monitoring
    tracesSampleRate: 0.001,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  }

  return (
    <>
      <script
        {...props}
        id="__dgatsby_sentry__"
        data-src={src}
        data-settings={JSON.stringify(sentrySettings)}
        data-commit={JSON.stringify(commitInfo)}
        dangerouslySetInnerHTML={{
          __html: `!function(){var e=window,t=document,r=t.getElementById("__dgatsby_sentry__"),a=JSON.parse(r.dataset.settings),n=JSON.parse(r.dataset.commit),s=e.Sentry;if("object"==typeof s)console.log("Sentry is already initialized");else{var s=t.createElement("script");s.type="text/javascript",s.defer=!0,s.src=r.dataset.src,s.onload=function(){e.Sentry.onLoad(function(){e.Sentry.init(a),e.Sentry.setTags(n),e.Sentry.setExtras(n)})},s.onerror=function(){console.error("Failed to load Sentry script")};var i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(s,i)}}();`,
        }}
      />
    </>
  )
})
