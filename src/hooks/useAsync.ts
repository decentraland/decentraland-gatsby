import { useState, useEffect } from 'react'

type AsyncState<A extends any[] = []> = {
  loading: boolean,
  args: A | null
}

export default function useAsync<A extends any[] = []>(callback: (...args: A) => Promise<any>) {
  const [ { loading, args }, setLoading ] = useState<AsyncState<A>>({ loading: false, args: null })

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
        if (cancelled) {
          return
        }

        setLoading({ loading: false, args: null })
      })

    return () => { cancelled = true }
  }, [ loading ])

  return [
    loading,
    (...args: A) => {
      setLoading({ loading: true, args })
    }
  ] as const
}