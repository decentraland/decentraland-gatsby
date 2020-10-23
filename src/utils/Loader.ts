export default class Loader<T> {
  
  cache: Map<string, Promise<T>> = new Map()

  constructor(private loader: (key: string) => Promise<T>) {}

  async load(key: string): Promise<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, this.loader(key))
    }
    
    return this.cache.get(key)!
  }

  clear(key: string) {
    return this.cache.delete(key)
  }

  clearAll() {
    const size = this.cache.size
    this.cache = new Map()
    return size
  }
}