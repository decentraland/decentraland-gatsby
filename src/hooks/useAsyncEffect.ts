import { useEffect, DependencyList } from "react";

export default function useAsyncEffect(callback: () => Promise<void | (() => void)>, dependencies?: DependencyList) {
  return useEffect(() => {
    const promise = callback().catch(err => console.error(`AsyncEffect error: `, err))
    return function () {
      promise.then((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      })
    }
  }, dependencies)
}