import isEthereumAddress from 'validator/lib/isEthereumAddress'
import rollbar from '../development/rollbar'
import segment from '../development/segment'
import 'isomorphic-fetch'

export type FeatureFlagsResponse = {
  // whether a feature flag is active.
  // Inactive flags aren't present in the response unless ?all is set in the URL or x-debug header is present
  flags: Record<string, boolean>

  variants: Record<string, Variant>
}

// variants are set to enable experiments or rollouts
// more info: https://unleash.github.io/docs/toggle_variants
export type Variant = {
  name: string
  enabled: boolean
  payload?: {
    type: string
    value: string
  }
}

export type UnleashOptions = {
  debug: boolean
  address: string
  referer: string
}

export const DEFAULT_FEATURE_FLAG: FeatureFlagsResponse = {
  flags: {},
  variants: {},
}

export default async function unleash(
  endpoint?: string | null,
  options: Partial<UnleashOptions> = {}
) {
  if (!endpoint) {
    return DEFAULT_FEATURE_FLAG
  }

  try {
    const headers: Record<string, string> = {}
    if (options.debug) {
      headers['x-debug'] = 'true'
    }

    if (options.address && isEthereumAddress(options.address)) {
      headers['x-address-hash'] = options.address
    }

    if (options.referer) {
      headers['Referer'] = options.referer
    }

    const req = await fetch(endpoint, { method: 'GET', headers })
    const body = await req.json()
    return body as FeatureFlagsResponse
  } catch (err) {
    console.error(err)
    rollbar((rollbar) => rollbar.error(err))
    segment((analytics) => analytics.track('error', {
      ...err,
      message: err.message,
      stack: err.stack,
    }))
    return DEFAULT_FEATURE_FLAG
  }
}
