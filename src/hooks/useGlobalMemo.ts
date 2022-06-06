import { hash } from 'immutable'
import { DependencyList, useMemo } from 'react'

const globalMemo = new Map<string, any>()
export default function useGlobalMemo<T>(
  callback: () => T,
  deps: DependencyList
) {
  return useMemo<T>(() => {
    const id = deps.map((dep) => hash(dep)).join('::')
    if (!globalMemo.has(id)) {
      globalMemo.set(id, callback())
    }

    return globalMemo.get(id)
  }, deps)
}
