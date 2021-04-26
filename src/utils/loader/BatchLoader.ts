import Dataloader from 'dataloader'

export default class BatchLoader<V, K = string | number> {
  private loader: Dataloader<K, V>
  cache: Map<K, Promise<V>> = new Map()
  data: Map<K, V> = new Map()
  readonly handle: (key: (K)[]) => Promise<V[]>

  constructor(handle: (key: (K)[]) => Promise<V[]>, options: Dataloader.Options<K, V> = {}) {
    this.handle = handle
    this.loader = new Dataloader(handle, options)
  }

  private async _handle(key: K): Promise<V> {
    return this.loader.load(key)
      .then(result => {
        this.data.set(key, result)
        return result
      })
      .catch(err => {
        this.cache.delete(key)
        throw err
      })
  }

  async load(key: K): Promise<V> {
    if (!this.cache.has(key)) {
      this.cache.set(key, this._handle(key))
    }

    return this.cache.get(key)!
  }

  isLoading(key: K) {
    return this.cache.has(key) && !this.data.has(key)
  }

  set(key: K, value: V) {
    this.cache.set(key, Promise.resolve(value))
    this.data.set(key, value)
  }

  clear(key: K) {
    this.loader.clear(key)
    this.data.delete(key)
    return this.cache.delete(key)
  }

  clearAll() {
    this.loader.clearAll()
    if (this.cache.size > 0) {
      this.cache = new Map()
      this.data = new Map()
      return true
    } else {
      return false
    }
  }
}