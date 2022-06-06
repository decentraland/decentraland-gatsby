import {
  FeatureFlagOptions,
  FeatureFlagsResult,
  fetchFlags,
} from '@dcl/feature-flags'
import { useCallback, useMemo } from 'react'

import FeatureFlags from '../utils/development/FeatureFlags'
import useAsyncState from './useAsyncState'

export const DEFAULT_FEATURE_FLAG = new FeatureFlags({
  flags: {},
  variants: {},
})

export type { FeatureFlagOptions, FeatureFlagsResult }

export default function useFeatureFlag(options: Partial<FeatureFlagOptions>) {
  const [ff, asyncState] = useAsyncState(
    async () => {
      if (!options.applicationName) {
        return DEFAULT_FEATURE_FLAG
      }

      const ff = await fetchFlags(options as FeatureFlagOptions)
      return new FeatureFlags(ff)
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
    /** @deprecated use ff.enabled(KEY) instead */
    (key: string) => {
      return (
        !!ff &&
        !!options.applicationName &&
        !!ff.flags[`${options.applicationName}-${key}`]
      )
    },
    [ff]
  )

  const getVariantName = useCallback(
    /** @deprecated use ff.name(KEY) instead */
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

  const getVariantValue = useCallback(
    /** @deprecated use ff.payload(KEY) instead */
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
    () => ({
      ...asyncState,
      isEnabled,
      getVariant: getVariantValue,
      getVariantValue,
      getVariantName,
    }),
    [asyncState, isEnabled, getVariantName, getVariantValue]
  )

  return [ff, state] as const
}
