export default class Loader<T> {
  
  cache: Map<string, Promise<T>> = new Map()
  data: Map<string, T> = new Map()

  constructor(private loader: (key: string) => Promise<T>) {}

  async load(key: string): Promise<T> {
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        this.loader(key)
          .then(result => {
            this.data.set(key, result)
            return result
          })
      )
    }
    
    return this.cache.get(key)!
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
    const size = this.cache.size
    this.cache = new Map()
    this.data = new Map()
    return size
  }
}