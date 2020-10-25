import { DependencyList, useState, useEffect } from 'react'

// TODO v3: replace onlyWithTruthyDeps params for an object
// TODO v3: replace onlyWithTruthyDeps params for an object
type AsyncMemoState<T> = {
  version: number,
  loading: boolean,
  value: T | null
}

export default function useAsyncMemo<T>(
  effect: () => Promise<T>,
  deps: DependencyList = [],
  onlyWithTruthyDeps: boolean = false
) {

  const [state, setState] = useState<AsyncMemoState<T>>({
    version: 0,
    loading: false,
    value: null
  })

  function load() {
    if (onlyWithTruthyDeps && deps.some(dep => Boolean(dep) === false)) {
      return
    }

    let cancelled = false
    const version = Math.ceil(Math.random() * 1e12)
    Promise.resolve()
      .then(() => {
        setState((current) => ({ version, value: current.value, loading: true }))
      })
      .then(() => effect())
      .then((value) => {
        if (!cancelled) {
          setState((current) => current.version === version ? { version, value, loading: false } : current)
        }
      })
      .catch(console.error)

    return () => {
      cancelled = true
    }
  }

  useEffect(load, deps)

  return [state.value, state.loading, load] as const
}