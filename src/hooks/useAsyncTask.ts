import { useState, useEffect } from 'react'
import rollbar from '../utils/development/rollbar'

type AsyncTaskState<A extends any[] = []> = {
  loading: boolean
  args: A | null
}

export default function useAsyncTask<A extends any[] = []>(
  callback: (...args: A) => Promise<any>
) {
  const [{ loading, args }, setLoading] = useState<AsyncTaskState<A>>({
    loading: false,
    args: null,
  })

  useEffect(() => {
    if (!loading) {
      return
    }

    if (args === null) {
      return
    }

    let cancelled = false
    Promise.resolve()
      .then(() => callback(...args))
      .then(() => {
        if (cancelled) {
          return
        }

        setLoading({ loading: false, args: null })
      })
      .catch((err) => {
        console.error(err)
        rollbar((rollbar) => rollbar.error(err))
        if (cancelled) {
          return
        }

        setLoading({ loading: false, args: null })
      })

    return () => {
      cancelled = true
    }
  }, [loading])

  return [
    loading,
    (...args: A) => {
      setLoading({ loading: true, args })
    },
  ] as const
}
