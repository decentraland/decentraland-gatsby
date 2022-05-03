import { FeatureFlagsResult } from '@dcl/feature-flags'

export function listFeatureFlags(ff: FeatureFlagsResult) {
  return [
    ...Object.keys(ff.flags).filter((flag) => ff.flags[flag]),
    ...Object.keys(ff.variants)
      .filter((flag) => ff.variants[flag].enabled)
      .map((flag) => `${flag}:${ff.variants[flag]?.name}`),
  ]
}
