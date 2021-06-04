import {
  createPool as createGenericPool,
  Factory,
  Options,
  Pool,
} from 'generic-pool'

export { Pool }

export function createItemPool<T>(items: T[]) {
  const queue = items.slice()

  const factory: Factory<T> = {
    create: async () => queue.shift() as T,
    destroy: async (client: T) => {
      queue.push(client)
    },
  }

  return createGenericPool<T>(factory, { min: 0, max: items.length })
}

export function createVoidPool(options?: Options) {
  const factory: Factory<any> = {
    create: async () => () => null,
    destroy: async () => {},
  }

  return createGenericPool(factory, options)
}
