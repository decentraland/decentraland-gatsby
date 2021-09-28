import { useCallback, useState } from 'react'

export default function usePatchState<T extends object>(initialState: T) {
  const [state, setState] = useState<T>(initialState)

  const patchState = useCallback(
    (newState: Partial<T>) => {
      return setState((current) => ({ ...current, ...newState }))
    },
    [state]
  )

  return [state, patchState] as const
}
