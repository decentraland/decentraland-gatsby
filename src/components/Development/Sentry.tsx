import React, { useEffect } from 'react'

import {
  BrowserOptions,
  BrowserTracing,
  Replay,
  init,
  setExtra,
} from '@sentry/gatsby'

import env from '../../utils/env'

export default React.memo(function Sentry({ dsn, ...props }: BrowserOptions) {
  dsn = dsn || env('SENTRY_DSN', process.env.GATSBY_SENTRY_DSN || '')

  if (!dsn) {
    console.warn(
      `skipping Sentry init inject: dsn and GATSBY_SENTRY_DSN is missing'`
    )
    return null
  }

  const COMMIT_SHA = env('COMMIT_SHA')
  if (COMMIT_SHA !== undefined) {
    setExtra('COMMIT_SHA', COMMIT_SHA)
  }

  const COMMIT_SHORT_SHA = env('COMMIT_SHORT_SHA')
  if (COMMIT_SHORT_SHA !== undefined) {
    setExtra('COMMIT_SHORT_SHA', COMMIT_SHORT_SHA)
  }

  const COMMIT_REF_NAME = env('COMMIT_REF_NAME')
  if (COMMIT_REF_NAME !== undefined) {
    setExtra('COMMIT_REF_NAME', COMMIT_REF_NAME)
  }

  const COMMIT_BRANCH = env('COMMIT_BRANCH')
  if (COMMIT_BRANCH !== undefined) {
    setExtra('COMMIT_BRANCH', COMMIT_BRANCH)
  }

  const COMMIT_TAG = env('COMMIT_TAG')
  if (COMMIT_TAG !== undefined) {
    setExtra('COMMIT_TAG', COMMIT_TAG)
  }

  useEffect(() => {
    if (!dsn) return

    init({
      environment: env('ENVIRONMENT', 'local'),
      release: `${process.env.REACT_APP_WEBSITE_NAME}@${process.env.REACT_APP_WEBSITE_VERSION}`,
      dsn,
      integrations: [new BrowserTracing(), new Replay()],
      // Performance Monitoring
      tracesSampleRate: 0.001, // Capture 1% of the transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      ...props,
    })
  }, [dsn])

  return <></>
})
