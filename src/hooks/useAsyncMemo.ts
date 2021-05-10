import { DependencyList, useState, useEffect } from 'react'

type AsyncMemoState<T> = {
  version: number,
  loading: boolean,
  value: T | null,
  time: number,
  error: Error | null
}

type AsyncMemoOptions<T = any> = {
  initialValue: T | null
  callWithTruthyDeps: boolean
}

/**
 * Execute and async function and save the result in the component memory,
 * it will execute again each time deps change, and it return only the result
 * for the latest change
 *
 * @param callback - async function
 * @param deps - dependency list
 * @param options.initialValue - initial memo value (default=null)
 * @param options.callWithTruthyDeps - if true the effect will be executed only when
 *   all values in the dependency list are evaluated as true
 */
export default function useAsyncMemo<T>(
  callback: () => Promise<T>,
  deps: DependencyList = [],
  options: Partial<AsyncMemoOptions<T>> = {}
) {
  const [state, setState] = useState<AsyncMemoState<T>>({
    version: 0,
    loading: false,
    value: options.initialValue ?? null,
    time: 0,
    error: null
  })

  function load() {
    if (options.callWithTruthyDeps && deps.some(dep => Boolean(dep) === false)) {
      return
    }

    setState((current) => ({ ...current, loading: true, version: current.version + 1 }))
  }

  useEffect(() => {
    if (options.callWithTruthyDeps && deps.some(dep => Boolean(dep) === false)) {
      return
    }

    let cancelled = false
    const loading = false
    const initial = Date.now()
    Promise.resolve()
      .then(() => callback())
      .then((value) => {
        if (cancelled) {
          return
        }

        setState((current) => ({
          ...current, value, error: null, loading, time: Date.now() - initial
        }))
      })
      .catch((error) => {
        console.error(error)
        if (cancelled) {
          return
        }

        setState((current) => ({
          ...current, value: current.value, error, loading, time: Date.now() - initial
        }))
      })

    return () => { cancelled = true }

  }, [ state.version, ...deps ])

  return [
    state.value,
    {
      version: state.version,
      loading: state.loading,
      error: state.error,
      time: state.time,
      reload: load
    }
  ] as const
}