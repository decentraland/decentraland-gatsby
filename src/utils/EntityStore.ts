import SingletonListener from './dom/SingletonListener'

/**
 * @deprecated
 */
export type EntityStoreState<E extends object> = {
  error: string | null
  loading: boolean
  data: Record<string, E>
  lists: Record<string, string[] | null>
}

export type EntityStoreOptions<E extends object> = {
  identifier: (state: E) => string
  initialState: Partial<EntityStoreState<E>>
}

export interface EntityStoreConstructor<E extends object> {
  new (): EntityStore<E>
}

export default class EntityStore<E extends object> {
  private config: EntityStoreOptions<E> = {
    identifier: (entity: E) => (entity as any).id,
    initialState: {},
  }

  private listener = new SingletonListener()

  private state: EntityStoreState<E> = {
    error: null,
    loading: false,
    data: {},
    lists: {},
  }

  constructor(config: Partial<EntityStoreOptions<E>> = {}) {
    Object.assign(this.config, config)
    Object.assign(this.state, this.config.initialState)
  }

  addEventListener(
    event: string,
    callback: (entity: EntityStoreState<E>) => void
  ) {
    this.listener.addEventListener(event as any, callback as any)
  }

  removeEventListener(
    event: string,
    callback: (entity: EntityStoreState<E>) => void
  ) {
    this.listener.removeEventListener(event as any, callback as any)
  }

  getState() {
    return this.state
  }

  getEntity(id: string): E | null {
    return this.state.data[id] || null
  }

  getList(listName = 'default') {
    if (this.state.lists[listName]) {
      const list = this.state.lists[listName]!
      return list.map((id) => this.state.data[id])
    }

    return null
  }

  setEntity(entity: E) {
    const id = this.config.identifier(entity)
    this.state = {
      ...this.state,
      data: {
        ...this.state.data,
        [id]: entity,
      },
    }

    this.listener.dispatch('change' as any, this.state)
  }

  setEntities(entities: E[], listName = 'default') {
    const data: Record<string, E> = {}
    const list: string[] = []

    for (const entity of entities) {
      const id = this.config.identifier(entity)
      data[id] = entity
      list.push(id)
    }

    this.state = {
      ...this.state,
      data: {
        ...this.state.data,
        ...data,
      },
      lists: {
        ...this.state.lists,
        [listName]: list,
      },
    }

    this.listener.dispatch('change' as any, this.state)
  }

  setError(error: Error) {
    this.state = {
      ...this.state,
      error: error.message,
    }

    this.listener.dispatch('change' as any, this.state)
  }

  setLoading(value = true) {
    if (this.state.loading !== value) {
      this.state = {
        ...this.state,
        loading: value,
      }

      this.listener.dispatch('change' as any, this.state)
    }

    return value
  }

  isLoading() {
    return !!this.state.loading
  }

  clearList(listName = 'default') {
    const lists = listName
      ? { ...this.state.lists, [listName]: null }
      : this.state.lists
    this.state = {
      ...this.state,
      lists,
    }

    this.listener.dispatch('change' as any, this.state)
  }

  clear() {
    this.state = {
      ...this.state,
      error: null,
      data: {},
      lists: {},
    }

    this.listener.dispatch('change' as any, this.state)
  }
}
