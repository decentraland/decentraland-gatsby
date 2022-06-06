import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import rollbar from '../utils/development/rollbar'
import segment from '../utils/development/segment'

type AsyncStateState<T, I = null> = {
  version: number
  loading: boolean
  value: T | I
  time: number
  error: Error | null
}

type AsyncStateOptions<T = any, I = null> = {
  initialValue: T | I
  callWithTruthyDeps: boolean
}

export type AsyncStateResultState<T, I = null> = {
  version: number
  time: number
  error: Error | null
  loading: boolean
  reload: () => void
  set: (value: ((current: T | I) => T) | T) => void
}

export type AsyncStateResult<T, I = null> = readonly [
  T | I,
  AsyncStateResultState<T, I>
]

export function createAsyncStateState<T, I = null>(
  value: T | I
): AsyncStateResultState<T, I> {
  return {
    version: 0,
    loading: false,
    time: 0,
    error: null,
    reload: () => {},
    set: () => {},
  }
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
export default function useAsyncState<T, I = null>(
  callback: () => Promise<T>,
  deps: DependencyList = [],
  options: Partial<AsyncStateOptions<T, I>> = {}
): AsyncStateResult<T, I> {
  const [state, setState] = useState<AsyncStateState<T, I>>({
    version: 0,
    loading: false,
    value: (options.initialValue ?? null) as I,
    time: 0,
    error: null,
  })

  const load = useCallback(() => {
    if (
      options.callWithTruthyDeps &&
      deps.some((dep) => Boolean(dep) === false)
    ) {
      return
    }

    setState((current) => ({
      ...current,
      loading: true,
      version: current.version + 1,
    }))
  }, [state, options.callWithTruthyDeps, ...deps])

  useEffect(() => {
    load()
  }, deps)

  useEffect(() => {
    if (!state.loading) {
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
          ...current,
          value,
          error: null,
          loading,
          time: Date.now() - initial,
        }))
      })
      .catch((err) => {
        console.error(err)
        rollbar((rollbar) => rollbar.error(err))
        segment((analytics) =>
          analytics.track('error', {
            ...err,
            message: err.message,
            stack: err.stack,
          })
        )
        if (cancelled) {
          return
        }

        setState((current) => ({
          ...current,
          value: current.value,
          error: err,
          loading,
          time: Date.now() - initial,
        }))
      })

    return () => {
      cancelled = true
    }
  }, [state])

  const set = useCallback(
    (value: ((current: T | I) => T) | T) => {
      const newValue: T =
        typeof value === 'function'
          ? (value as (current: T | I) => T)(state.value)
          : value
      setState((current) => ({ ...current, value: newValue }))
    },
    [state]
  )

  const actions = useMemo(
    () => ({
      version: state.version,
      loading: state.loading,
      error: state.error,
      time: state.time,
      reload: load,
      set,
    }),
    [state, load, set]
  )

  return [state.value, actions] as const
}
