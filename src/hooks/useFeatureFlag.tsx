import useAsyncMemo from './useAsyncMemo'

type FeatureFlagsResponse = {
  // whether a feature flag is active.
  // Inactive flags aren't present in the response unless ?all is set in the URL or x-debug header is present
  flags: Record<string, boolean>

  variants: Record<string, Variant>
}

// variants are set to enable experiments or rollouts
// more info: https://unleash.github.io/docs/toggle_variants
type Variant = {
  name: string
  enabled: boolean
  payload?: {
    type: string
    value: string
  }
}

export const DEFAULT_FEATURE_FLAG: FeatureFlagsResponse = {
  flags: {},
  variants: {},
}

export default function useFeatureFlag(endpoint?: string | null) {
  return useAsyncMemo(async () => {
    if (!endpoint) {
      return DEFAULT_FEATURE_FLAG
    }

    try {
      const req = await fetch(endpoint)
      const body = await req.json()
      return body as FeatureFlagsResponse
    } catch (err) {
      console.error(err)
      return DEFAULT_FEATURE_FLAG
    }
  }, [ endpoint ], { callWithTruthyDeps: true, initialValue: DEFAULT_FEATURE_FLAG })
}