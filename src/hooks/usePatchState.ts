import { useCallback, useState } from 'react'

export default function usePatchState<T extends {}>(initialState: T) {
  const [state, setState] = useState<T>(initialState)

  const patchState = useCallback((newState: Partial<T>) => {
    return setState((current) => ({ ...current, ...newState }))
  }, [])

  return [state, patchState] as const
}
