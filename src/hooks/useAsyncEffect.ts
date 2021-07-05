import { useEffect, DependencyList } from 'react'
import rollbar from '../utils/development/rollbar'

export default function useAsyncEffect(
  callback: () => Promise<void | (() => void)>,
  dependencies?: DependencyList
) {
  return useEffect(() => {
    const promise = callback().catch((err) =>{
      console.error(`AsyncEffect error: `, err)
      rollbar((rollbar) => rollbar.error('AsyncEffect error', err))
    })
    return function () {
      promise.then((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      })
    }
  }, dependencies)
}
