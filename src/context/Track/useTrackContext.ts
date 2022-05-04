import { useCallback } from 'react'
import { track } from '../../utils/development/segment'
import useAuthContext from '../Auth/useAuthContext'
import useFeatureFlagContext from '../FeatureFlag/useFeatureFlagContext'

export default function useTrackContext() {
  const [ethAddress] = useAuthContext()
  const [ff] = useFeatureFlagContext()

  return useCallback(
    (
      event: string,
      data?: Record<string, any>,
      callback?: (() => void) | undefined
    ): void =>
      track(
        event,
        {
          ...data,
          ethAddress,
          featureFlags: ff.list(),
        },
        callback
      ),
    [ethAddress, ff]
  )
}
