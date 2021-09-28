import unleash, { DEFAULT_FEATURE_FLAG } from '../utils/api/unleash'
import useAsyncState from './useAsyncState'

export { DEFAULT_FEATURE_FLAG }

export default function useFeatureFlag(endpoint?: string | null) {
  return useAsyncState(() => unleash(endpoint), [endpoint], {
    callWithTruthyDeps: true,
    initialValue: DEFAULT_FEATURE_FLAG,
  })
}
