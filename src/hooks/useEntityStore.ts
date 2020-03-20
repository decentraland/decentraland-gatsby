import { hash } from "immutable"
import { useState, useEffect } from "react"
import EntityStore, { EntityStoreState } from "../utils/EntityStore"

const stores = new Map<number, EntityStore<any>>()

export default function useEntityStore<E extends object>(
  identifier: any
) {

  const key = hash(identifier)
  if (!stores[key]) {
    stores[key] = new EntityStore<E>()
  }

  const store = stores[key]
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