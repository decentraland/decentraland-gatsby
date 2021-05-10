import { useState, useEffect } from 'react'

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
export default function useAsync<T>(callback: () => Promise<T>) {
  const [ loading, setLoading ] = useState(false)
  useEffect(() => {
    if (loading) {
      return
    }

    let cancelled = false
    Promise.resolve()
      .then(callback)
      .then(() => {
        if (cancelled) {
          return
        }

        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        if (cancelled) {
          return
        }

        setLoading(false)
      })

    return () => { cancelled = true }
  }, [ loading ])

  return [ loading, () => { setLoading(true) } ] as const
}