import type { FeatureFlagsResult } from '@dcl/feature-flags'

export default class FeatureFlags {
  static toArray(ff: FeatureFlagsResult) {
    return [
      ...Object.keys(ff.flags).filter((flag) => ff.flags[flag]),
      ...Object.keys(ff.variants)
        .filter((flag) => ff.variants[flag]?.enabled)
        .map((flag) => `${flag}:${ff.variants[flag].name}`),
    ]
  }

  readonly flags: FeatureFlagsResult['flags']
  readonly variants: FeatureFlagsResult['variants']
  readonly error: FeatureFlagsResult['error']

  private _names = new Map<string, string>()
  private _payloads = new Map<string, any>()
  private _list: string[]

  constructor(ff: Partial<FeatureFlagsResult>) {
    this.flags = ff.flags || {}
    this.variants = ff.variants || {}
    this.error = ff.error
    this._list = FeatureFlags.toArray(this)
  }

  private getFrom<R>(map: Map<string, R>, key: string, callback: () => R): R {
    if (map.has(key)) {
      return map.get(key)!
    }

    const result = callback()
    map.set(key, result)
    return result
  }

  enabled(key: string) {
    return !!this.flags[key]
  }

  name<T extends string>(key: string, defaultValue: T): T {
    return this.getFrom<T>(this._names as any, key, () => {
      if (
        this.enabled(key) &&
        this.variants[key] &&
        this.variants[key].enabled &&
        this.variants[key].name
      ) {
        return this.variants[key]?.name as T
      }

      return defaultValue
    })
  }

  payload<T>(key: string, defaultValue: T): T {
    return this.getFrom<T>(this._payloads, key, () => {
      if (
        this.enabled(key) &&
        this.variants[key] &&
        this.variants[key].enabled &&
        this.variants[key].payload
      ) {
        const { type, value } = this.variants[key].payload!
        switch (type) {
          case 'json':
            try {
              return JSON.parse(value)
            } catch (e) {
              console.error(e)
              return defaultValue
            }
          default:
            return value
        }
      }

      return defaultValue
    })
  }

  list() {
    return this._list
  }
}
