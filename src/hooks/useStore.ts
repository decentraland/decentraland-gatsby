import React, { useEffect, useMemo, useState } from 'react'

import EntityStore, { EntityStoreState } from '../utils/EntityStore'

const INITIAL_STATE = {}

/**
 * @deprecated
 * @param initialState
 * @param deps
 * @returns
 */
export default function useStore<E extends object>(
  initialState: Partial<EntityStoreState<E>> = INITIAL_STATE,
  deps: React.DependencyList = []
) {
  const store = useMemo(() => new EntityStore<E>({ initialState }), deps)
  const [current, setState] = useState(store.getState())

  useEffect(() => {
    function handleChange(newState: EntityStoreState<E>) {
      if (current !== newState) {
        setState(newState)
      }
    }

    store.addEventListener('change', handleChange)
    return () => store.removeEventListener('change', handleChange)
  }, [store])

  return store
}
