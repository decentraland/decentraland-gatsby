import React, { createContext } from 'react'
import useFeatureFlag, {
  DEFAULT_FEATURE_FLAG,
} from '../../hooks/useFeatureFlag'

const defaultTransactionState: ReturnType<typeof useFeatureFlag> = [
  DEFAULT_FEATURE_FLAG,
  {
    loading: false,
    error: null,
    time: 0,
    version: 0,
    set: () => null,
    reload: () => null,
  },
]

export const FeatureFlagContext = createContext(defaultTransactionState)
export default React.memo(function AuthProvider(
  props: React.PropsWithChildren<{}> & { endpoint: string }
) {
  const ff = useFeatureFlag(props.endpoint)
  return (
    <FeatureFlagContext.Provider value={ff}>
      {props.children}
    </FeatureFlagContext.Provider>
  )
})
