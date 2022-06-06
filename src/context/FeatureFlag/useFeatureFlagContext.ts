import { useContext } from 'react'

import { FeatureFlagContext } from './FeatureFlagProvider'

export default function useFeatureFlagContext() {
  return useContext(FeatureFlagContext)
}
