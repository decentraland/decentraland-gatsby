import unleash, { DEFAULT_FEATURE_FLAG } from '../utils/api/unleash'
import useAsyncMemo from './useAsyncMemo'

export { DEFAULT_FEATURE_FLAG }

export default function useFeatureFlag(endpoint?: string | null) {
  return useAsyncMemo(
    () => unleash(endpoint),
    [ endpoint ],
    { callWithTruthyDeps: true, initialValue: DEFAULT_FEATURE_FLAG }
  )
}