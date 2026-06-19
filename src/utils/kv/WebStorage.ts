import { uid } from 'radash/dist/random'

import SingletonListener from '../dom/SingletonListener'
import StringBaseKV from './StringBaseKV'
import { KVGetOptions, KVPutOptions, KVTypeMap } from './types'

const STORAGE_WRITER_ID = uid(12)

type Data = {
  value: string
  timestamp: number
  expirationTtl: number
  wroteBy: string
}

export type WebStorageOptions = Partial<{
  prefix: string
}>

export default class WebStorage extends StringBaseKV {
  static Instances = new Set<WebStorage>()
  static Listiner: SingletonListener<any> | null = null
  static listen(instance: WebStorage) {
    WebStorage.Instances.add(instance)
    if (!WebStorage.Listiner && typeof window !== 'undefined') {
      WebStorage.Listiner = new SingletonListener(window).addEventListener(
        'storage',
        (event: StorageEvent) => {
          WebStorage.Instances.forEach((instance) => {
            if (
              instance.storage === event.storageArea &&
              event.key &&
              instance.isInNamespace(event.key)
            ) {
              const newData =
                (event.newValue && instance.parseData(event.newValue)) || null

              if (newData) {
                if (newData.wroteBy !== STORAGE_WRITER_ID) {
                  instance.#cache.set(event.key, newData)
                }
              } else {
                instance.#cache.delete(event.key)
              }
            }
          })
        }
      )
    }
  }

  static stopListen(instance: WebStorage) {
    WebStorage.Instances.delete(instance)
  }

  #storage: Storage
  #options: WebStorageOptions
  #cache: Map<string, Data>

  get storage() {
    return this.#storage
  }

  get options() {
    return this.#options
  }

  constructor(storage: Storage, options: WebStorageOptions = {}) {
    super()
    this.#storage = storage
    this.#options = Object.freeze({ ...options })
    this.#cache = new Map()
  }

  withNamespace(key: string) {
    return this.#options.prefix ? `${this.#options.prefix}/${key}` : key
  }

  isInNamespace(key: string) {
    return this.#options.prefix
      ? key.startsWith(this.#options.prefix + '/')
      : true
  }

  getData(namespacedKey: string) {
    const stored = this.#storage.getItem(namespacedKey)
    if (!stored) {
      return null
    }

    return this.parseData(stored)
  }

  parseData(stored: string): Data | null {
    const data = JSON.parse(stored) as Data
    if (
      !data ||
      typeof data.value !== 'string' ||
      typeof data.timestamp !== 'number' ||
      typeof data.expirationTtl !== 'number'
    ) {
      return null
    }

    return data
  }

  setData(namespacedKey: string, data: Data) {
    this.#cache.set(namespacedKey, data)
    this.#storage.setItem(namespacedKey, JSON.stringify(data))
  }

  removeData(namespacedKey: string) {
    this.#cache.delete(namespacedKey)
    this.#storage.removeItem(namespacedKey)
    return true
  }

  async put(
    key: string,
    value: string | ArrayBuffer,
    options?: KVPutOptions
  ): Promise<boolean> {
    const namespacedKey = this.withNamespace(key)
    const timestamp = Date.now()
    const expirationTtl = this.calculateExpirationTtl(options, Infinity)

    if (expirationTtl <= 0) {
      return false
    }

    const data: Data = {
      value: this.calculatePutValue(value),
      timestamp,
      expirationTtl,
      wroteBy: STORAGE_WRITER_ID,
    }

    this.setData(namespacedKey, data)
    return true
  }

  async get<T extends keyof KVTypeMap = 'text'>(
    key: string,
    options?: KVGetOptions<T> | undefined
  ): Promise<KVTypeMap[T] | null> {
    const now = Date.now()
    const namespacedKey = this.withNamespace(key)
    const data = this.#cache.get(namespacedKey) || this.getData(namespacedKey)
    if (!data) {
      return null
    }

    if (data.timestamp + data.expirationTtl < now) {
      this.removeData(namespacedKey)
      return null
    }

    return this.calculateGetValue(data, options)
  }

  async delete(key: string): Promise<boolean> {
    const namespacedKey = this.withNamespace(key)
    return this.removeData(namespacedKey)
  }
}
