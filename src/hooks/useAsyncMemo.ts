import { DependencyList, useState, useEffect } from 'react'

type AsyncMemoState<T> = {
  version: number,
  loading: boolean,
  value: T | null
}

type AsyncMemoOptions<T = any> = {
  intialValue: T | null
  callWithTruthyDeps: boolean
}

/**
 * Execute and async function and save the result in the component memory,
 * it will execute again each time deps change, and it return only the result
 * for the latest change
 *
 * @param effect - async function
 * @param deps - dependency list
 * @param options.intialValue - initial memo value (default=null)
 * @param options.callWithTruthyDeps - if true the effect will be executed only when
 *   all values in the dependency list are evaluated as true
 */
export default function useAsyncMemo<T>(
  effect: () => Promise<T>,
  deps: DependencyList = [],
  options: Partial<AsyncMemoOptions<T>> = {}
) {

  const [state, setState] = useState<AsyncMemoState<T>>({
    version: 0,
    loading: false,
    value: options.intialValue ?? null
  })

  function load() {
    if (options.callWithTruthyDeps && deps.some(dep => Boolean(dep) === false)) {
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