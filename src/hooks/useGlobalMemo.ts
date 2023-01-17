// TODO(#323): remove on v6
import { DependencyList, useMemo } from 'react'

import singleton from '../utils/immutable/singleton'

const globalMemo = new Map<string, any>()
/**
 * @deprecated
 */
export default function useGlobalMemo<T>(
  callback: () => T,
  deps: DependencyList
) {
  return useMemo<T>(() => {
    const id = deps.map((dep) => singleton(dep)).join('::')
    if (!globalMemo.has(id)) {
      globalMemo.set(id, callback())
    }

    return globalMemo.get(id)
  }, deps)
}
