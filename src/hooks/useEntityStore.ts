// TODO(2fd): remove on v6
import { useEffect, useState } from 'react'

import EntityStore, { EntityStoreState } from '../utils/EntityStore'

/**
 * @deprecated
 * @param store
 * @returns
 */
export default function useEntityStore<E extends {}>(store: EntityStore<E>) {
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
