import { useState, useEffect } from "react"
import EntityStore, { EntityStoreState } from "../utils/EntityStore"

export default function useEntityStore<E extends object>(
  store: EntityStore<E>
) {

  const [state, setState] = useState(store.getState())

  useEffect(() => {
    function handleChange(newState: EntityStoreState<E>) {
      if (state !== newState) {
        setState(newState)
      }
    }

    store.addEventListener('change', handleChange)

    return function removeStoreListener() {
      store.removeEventListener('change', handleChange)
    }
  }, [])

  return state
}