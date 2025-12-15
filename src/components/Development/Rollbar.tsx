import React from 'react'

import env from '../../utils/env'

export type RollbarProps = React.ScriptHTMLAttributes<HTMLScriptElement> &
  React.HTMLProps<HTMLScriptElement> & {
    accessToken?: string
    captureUncaught?: boolean
    captureUnhandledRejections?: boolean
    payload?: Record<string, string | number>
    version?: string
  }

/** @deprecated */
export default React.memo(function Rollbar({
  accessToken,
  captureUncaught,
  captureUnhandledRejections,
  payload,
  version,
  src,
  ...props
}: RollbarProps) {
  version = version || 'v2.26.1'
  accessToken =
    accessToken || env('ROLLBAR_TOKEN', process.env.GATSBY_ROLLBAR_TOKEN || '')
  if (!accessToken) {
    console.warn(
      `skipping rollbar inject: accessToken and GATSBY_ROLLBAR_TOKEN is missing'`
    )
    return null
  }

  const rollbarPayload: Record<string, string | number> = {
    environment: env('ENVIRONMENT', 'local'),
  }

  const COMMIT_SHA = env('COMMIT_SHA')
  if (COMMIT_SHA !== undefined) {
    rollbarPayload.COMMIT_SHA = COMMIT_SHA
  }

  const COMMIT_SHORT_SHA = env('COMMIT_SHORT_SHA')
  if (COMMIT_SHORT_SHA !== undefined) {
    rollbarPayload.COMMIT_SHORT_SHA = COMMIT_SHORT_SHA
  }

  const COMMIT_REF_NAME = env('COMMIT_REF_NAME')
  if (COMMIT_REF_NAME !== undefined) {
    rollbarPayload.COMMIT_REF_NAME = COMMIT_REF_NAME
  }

  const COMMIT_BRANCH = env('COMMIT_BRANCH')
  if (COMMIT_BRANCH !== undefined) {
    rollbarPayload.COMMIT_BRANCH = COMMIT_BRANCH
  }

  const COMMIT_TAG = env('COMMIT_TAG')
  if (COMMIT_TAG !== undefined) {
    rollbarPayload.COMMIT_TAG = COMMIT_TAG
  }

  Object.assign(rollbarPayload, payload)

  const _rollbarConfig = {
    accessToken,
    captureUncaught: captureUncaught !== false,
    captureUnhandledRejections: captureUnhandledRejections !== false,
    rollbarJsUrl: src,
    payload: rollbarPayload,
    // payload: {
    //   environment: env('ENVIRONMENT', 'local'),
    //   COMMIT_SHA: env('COMMIT_SHA', '0000000000000000000000000000000000000000'),
    //   COMMIT_SHORT_SHA: env('COMMIT_SHORT_SHA', '00000000'),
    //   COMMIT_REF_NAME: env('COMMIT_REF_NAME', 'missing'),
    //   COMMIT_BRANCH: env('COMMIT_BRANCH', 'missing'),
    //   COMMIT_TAG: env('COMMIT_TAG', 'missing'),
    //   ...(payload || {}),
    // },
  }

  const rollbarJsUrl =
    (src as string) ||
    `https://cdn.rollbar.com/rollbarjs/refs/tags/${version}/rollbar.min.js`

  return (
    <>
      {/* Rollbar SDK script loaded directly in static HTML */}
      <script key="rollbar-sdk" async src={rollbarJsUrl} />
      {/* Rollbar initialization script - runs after SDK loads */}
      <script
        {...props}
        id="__dgatsby_rollbar__"
        data-config={JSON.stringify(_rollbarConfig)}
        dangerouslySetInnerHTML={{
          __html: `!function(){var r=document.getElementById("__dgatsby_rollbar__"),c=JSON.parse(r.dataset.config);function init(){if(window.Rollbar){window.Rollbar.init(c);}else{setTimeout(init,50);}}init();}();`,
        }}
      />
    </>
  )
})
