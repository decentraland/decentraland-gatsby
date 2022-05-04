import React, { createContext, useEffect, useMemo } from 'react'
import useFeatureFlag, {
  DEFAULT_FEATURE_FLAG,
  FeatureFlagOptions,
} from '../../hooks/useFeatureFlag'
import { track } from '../../utils/development/segment'
import useAuthContext from '../Auth/useAuthContext'

const defaultTransactionState: ReturnType<typeof useFeatureFlag> = [
  DEFAULT_FEATURE_FLAG,
  {
    loading: false,
    error: null,
    time: 0,
    version: 0,
    set: () => null,
    reload: () => null,
    isEnabled: () => false,
    getVariant: () => null as any,
    getVariantName: () => null as any,
    getVariantValue: () => null as any,
  },
]

export const FeatureFlagContext = createContext(defaultTransactionState)
export type FeatureFlagProviderProps = React.PropsWithChildren<{}> &
  Partial<Omit<FeatureFlagOptions, 'userId'>> & {
    /** @deprecated use applicationName instead */
    endpoint: string
  }

export default React.memo(function FeatureFlagProvider(
  props: React.PropsWithChildren<{}> &
    Partial<Omit<FeatureFlagOptions, 'userId'>> & { endpoint: string }
) {
  const [userId] = useAuthContext()
  const options = useMemo<Partial<FeatureFlagOptions>>(() => {
    if (!props.endpoint && !props.applicationName) {
      return {}
    }

    const result: Partial<FeatureFlagOptions> = {}
    if (props.applicationName) {
      result.applicationName = props.applicationName
    } else {
      const endpoint = new URL(props.endpoint)
      const applicationName = endpoint.pathname.slice(1, -5)
      if (applicationName) {
        result.applicationName = applicationName
      }
    }

    if (result.applicationName) {
      if (props.debug) {
        result.debug = props.debug
      }

      if (props.featureFlagsUrl) {
        result.featureFlagsUrl = props.featureFlagsUrl
      }

      if (userId) {
        result.userId = userId
      }
    }

    return result
  }, [
    props.endpoint,
    props.applicationName,
    props.debug,
    props.featureFlagsUrl,
    userId,
  ])

  const ff = useFeatureFlag(options)

  useEffect(() => {
    const [features] = ff
    if (features !== DEFAULT_FEATURE_FLAG) {
      track('feature_flags', { featureFlags: features.list() })
    }
  }, [ff])

  return (
    <FeatureFlagContext.Provider value={ff}>
      {props.children}
    </FeatureFlagContext.Provider>
  )
})
