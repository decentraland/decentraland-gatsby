import { DependencyList, useState } from 'react'
import useAsyncEffect from './useAsyncEffect'

type AsyncMemoState<T> = {
  version: number,
  value: T | null
}

export default function useAsyncMemo<T>(exec: () => Promise<T>, deps: DependencyList = []) {

  const [state, setState] = useState<AsyncMemoState<T>>({
    version: 0,
    value: null
  })

  useAsyncEffect(async () => {
    const version = Math.ceil(Math.random() * 1e12)
    try {
      setState((current) => ({ version, value: current.value }))
      const value = await exec()
      setState((current) => current.version === version ? { version, value } : current)
    } catch (err) {
      console.error(err)
    }
  }, deps)

  return state.value
}