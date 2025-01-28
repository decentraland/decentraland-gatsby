import {
  KV,
  KVGetOptions,
  KVPutExpirationOptions,
  KVPutOptions,
  KVPutTtlOptions,
  KVType,
  KVTypeMap,
} from './types'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

type Data = {
  value: string
  timestamp: number
  expirationTtl: number
}

export default abstract class StringBaseKV<D extends Data = Data>
  implements KV
{
  calculateExpirationTtl(options: KVPutOptions = {}, defaultValue = Infinity) {
    /** calulate expirationTtl value  */
    let expirationTtl = defaultValue
    if (options) {
      const ttl = options as KVPutTtlOptions
      if (
        ttl.expirationTtl !== undefined &&
        Number.isFinite(ttl.expirationTtl)
      ) {
        expirationTtl = ttl.expirationTtl
      }

      const exp = options as KVPutExpirationOptions
      if (exp.expiration !== undefined && Number.isFinite(exp.expiration)) {
        if (exp.expiration < 0) {
          throw new TypeError(`expirationTtl must be a positive integer`)
        }

        expirationTtl = exp.expiration
      }
    }

    return expirationTtl
  }

  calculatePutValue(value: string | ArrayBuffer) {
    return typeof value === 'string' ? value : decoder.decode(value)
  }

  calculateGetValue<T extends KVType = 'text'>(
    data: D,
    options?: KVGetOptions<T>
  ): KVTypeMap[T] {
    switch (options?.type) {
      case 'json':
        return JSON.parse(data.value)
      case 'arrayBuffer':
        return encoder.encode(data.value).buffer as KVTypeMap[T]
      default:
        return data.value as KVTypeMap[T]
    }
  }

  abstract put(
    key: string,
    value: string | ArrayBuffer,
    options?: KVPutOptions
  ): Promise<boolean>
  abstract get<T extends KVType = 'text'>(
    key: string,
    options?: KVGetOptions<T>
  ): Promise<KVTypeMap[T] | null>
  abstract delete(key: string): Promise<boolean>
}
