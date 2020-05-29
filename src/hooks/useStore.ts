import { useState, useEffect, useMemo } from "react"
import EntityStore, { EntityStoreState } from "../utils/EntityStore"

export default function useStore<E extends object>(
  initialState: Partial<EntityStoreState<E>>
) {

  const [st] = useState(initialState)
  const store = useMemo(() => new EntityStore<E>({ initialState: st }), [st])
  const [, setState] = useState(store.getState())

  useEffect(() => {
    function handleChange(newState: EntityStoreState<E>) {
      if (st !== newState) {
        setState(newState)
      }
    }

    store.addEventListener('change', handleChange)

    return function removeStoreListener() {
      store.removeEventListener('change', handleChange)
    }
  }, [])

  return store
}