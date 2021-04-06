import Dataloader from 'dataloader'

export default class BatchLoader<T> {
  private loader: Dataloader<string | number, T>
  cache: Map<string | number, Promise<T>> = new Map()
  data: Map<string | number, T> = new Map()
  readonly handle: (key: (string | number)[]) => Promise<T[]>

  constructor(handle: (key: (string | number)[]) => Promise<T[]>, options: Dataloader.Options<string|number, T> = {}) {
    this.handle = handle
    this.loader = new Dataloader(handle, options)
  }

  private async _handle(key: string | number): Promise<T> {
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

  async load(key: string | number): Promise<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, this._handle(key))
    }

    return this.cache.get(key)!
  }

  isLoading(key: string | number) {
    return this.cache.has(key) && !this.data.has(key)
  }

  set(key: string | number, value: T) {
    this.cache.set(key, Promise.resolve(value))
    this.data.set(key, value)
  }

  clear(key: string | number) {
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