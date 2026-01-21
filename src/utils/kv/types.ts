export type KVTypeMap = {
  text: string
  json: Record<string, any> | string | number | boolean
  arrayBuffer: ArrayBuffer
}

export type KVType = keyof KVTypeMap

/**
 * Options for the KV.put method.
 */
export type KVPutExpirationOptions = {
  /**
   * Set a key’s expiration using an absolute time specified in a number of
   * [seconds since the UNIX epoch](https://en.wikipedia.org/wiki/Unix_time).
   * For example, if you wanted a key to expire at 12:00AM UTC on April 1, 2019,
   * you would set the key’s expiration to 1554076800.
   */
  expiration: number
}

/**
 * Options for the KV.put method.
 */
export type KVPutTtlOptions = {
  /**
   * Set a key’s expiration time to live (TTL) using a relative number of seconds
   * from the current time.
   * For example, if you wanted a key to expire 10 minutes after creating it,
   * you would set its expiration TTL to 600.
   */
  expirationTtl: number
}

/**
 * Options for the KV.put method.
 */
export type KVPutOptions = {} | KVPutExpirationOptions | KVPutTtlOptions

/**
 * Options for the KV.get method.
 */
export type KVGetOptions<T extends KVType> = {
  /**
   * The type of the value to be returned.
   *
   * - "text": A string (default).
   * - "json":  An object decoded from a JSON string.
   * - "arrayBuffer": An [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) instance.
   */
  type?: T
}

export interface KV {
  /**
   * Adds or updates an entry in a KV object with a specified key and a value.
   *
   * @param key The key to associate with the value. A key cannot be empty, `.`
   * or `..`, all other keys are valid.
   *
   * @param value The value to store. The type is inferred.
   *
   * @param options Options for the method call.
   */
  put(
    key: string,
    value: string | ArrayBuffer,
    options?: KVPutOptions
  ): Promise<boolean>

  /**
   * Returns the specified element from a KV object for a given key.
   *
   * @param key The key to associate with the value. A key cannot be empty, `.`
   * or `..`, all other keys are valid.
   *
   * @param options Options for the method call.
   */
  get<T extends KVType = 'text'>(
    key: string,
    options?: KVGetOptions<T>
  ): Promise<KVTypeMap[T] | null>

  /**
   * Removes the specified element from a KV object for a given key.
   *
   * @param key The key to associate with the value. A key cannot be empty, `.`
   * or `..`, all other keys are valid.
   */
  delete(key: string): Promise<boolean>
}
