import StringBaseKV from './StringBaseKV'
import { KVGetOptions, KVPutOptions, KVType, KVTypeMap } from './types'

type Data = {
  value: string
  timestamp: number
  expirationTtl: number
}

export default class Memory extends StringBaseKV<Data> {
  #store: Map<string, Data> = new Map()

  async put(
    key: string,
    value: string | ArrayBuffer,
    options?: KVPutOptions
  ): Promise<boolean> {
    const timestamp = Date.now()
    const expirationTtl = this.calculateExpirationTtl(options, Infinity)

    if (expirationTtl <= 0) {
      return false
    }

    const data: Data = {
      value: this.calculatePutValue(value),
      timestamp,
      expirationTtl,
    }

    this.#store.set(key, data)
    return true
  }

  async get<T extends KVType = 'text'>(
    key: string,
    options?: KVGetOptions<T>
  ): Promise<KVTypeMap[T] | null> {
    const now = Date.now()
    const data = this.#store.get(key)
    if (data === undefined) {
      return null
    }

    if (data.timestamp + data.expirationTtl < now) {
      this.#store.delete(key)
      return null
    }

    return this.calculateGetValue(data, options)
  }

  async delete(key: string) {
    return this.#store.delete(key)
  }
}
