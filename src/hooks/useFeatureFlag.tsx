import { useCallback, useMemo } from 'react'
import {
  FeatureFlagsResult,
  FeatureFlagOptions,
  fetchFlags,
} from '@dcl/feature-flags'
import useAsyncState from './useAsyncState'

export const DEFAULT_FEATURE_FLAG: FeatureFlagsResult = {
  flags: {},
  variants: {},
}

export type { FeatureFlagOptions, FeatureFlagsResult }

export default function useFeatureFlag(options: Partial<FeatureFlagOptions>) {
  const [ff, asyncState] = useAsyncState(
    async () => {
      if (!options.applicationName) {
        return DEFAULT_FEATURE_FLAG
      }

      return fetchFlags(options as FeatureFlagOptions)
    },
    [
      options.applicationName,
      options.debug,
      options.featureFlagsUrl,
      options.userId,
    ],
    {
      initialValue: DEFAULT_FEATURE_FLAG,
    }
  )

  const isEnabled = useCallback(
    (key: string) => {
      return (
        !!ff &&
        !!options.applicationName &&
        !!ff.flags[`${options.applicationName}-${key}`]
      )
    },
    [ff]
  )

  const getVariant = useCallback(
    <K extends string = string, D = null>(
      key: string,
      defaultVariant: D
    ): K | D => {
      if (isEnabled(key)) {
        const variant = ff.variants[`${options.applicationName}-${key}`]
        if (variant.payload?.value) {
          return variant.payload.value as K
        }
      }

      return defaultVariant ?? (null as any)
    },
    [ff]
  )

  const state = useMemo(
    () => ({ ...asyncState, isEnabled, getVariant }),
    [asyncState, isEnabled, getVariant]
  )

  return [ff, state] as const
}
