export default class Loader<T> {

  cache: Map<string, Promise<T>> = new Map()
  data: Map<string, T> = new Map()

  constructor(public readonly handle: (key: string) => Promise<T>) {}

  async _handle(key: string): Promise<T> {
    return this.handle(key)
      .then(result => {
        this.data.set(key, result)
        return result
      })
      .catch(err => {
        this.cache.delete(key)
        throw err
      })
  }

  async load(key: string): Promise<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, this._handle(key))
    }

    return this.cache.get(key)!
  }

  isLoading(key: string) {
    return this.cache.has(key) && !this.data.has(key)
  }

  set(key: string, value: T) {
    this.cache.set(key, Promise.resolve(value))
    this.data.set(key, value)
  }

  clear(key: string) {
    this.data.delete(key)
    return this.cache.delete(key)
  }

  clearAll() {
    if (this.cache.size > 0) {
      this.cache = new Map()
      this.data = new Map()
      return true
    } else {
      return false
    }
  }
}