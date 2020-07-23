import { DependencyList, useState } from 'react'
import useAsyncEffect from './useAsyncEffect'

type AsyncMemoState<T> = {
  version: number,
  loading: boolean,
  value: T | null
}

export default function useAsyncMemo<T>(exec: () => Promise<T>, deps: DependencyList = []) {

  const [state, setState] = useState<AsyncMemoState<T>>({
    version: 0,
    loading: false,
    value: null
  })

  async function load() {
    const version = Math.ceil(Math.random() * 1e12)
    try {
      setState((current) => ({ version, value: current.value, loading: true }))
      const value = await exec()
      setState((current) => current.version === version ? { version, value, loading: false } : current)
    } catch (err) {
      console.error(err)
    }
  }

  useAsyncEffect(load, deps)

  return [state.value, state.loading, load]
}