import { useState } from 'react'

export default function usePatchState<T extends object>(initialState: T) {
  const [state, setState] = useState<T>(initialState)

  function patchState(newState: Partial<T>) {
    return setState(current => ({ ...current, ...newState }))
  }

  return [state, patchState] as const
}