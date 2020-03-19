import { useState } from 'react'
import { hash } from 'immutable'

const cache = new Map<number, Map<string, any>>()

export default function useLoader<R>(loader: (id: string) => Promise<R>) {
  const [value, setValue] = useState<R | null>(null)

  async function load(id: string): Promise<R> {
    setValue(null)
    const key = hash(loader)
    if (!cache.has(key)) {
      cache.set(key, new Map())
    }

    if (!cache.get(key)!.has(id)) {
      cache.get(key)!.set(id, loader(id).catch(err => {
        console.error(err);
        return null
      }))
    }

    const newValue = await cache.get(key)!.get(id)!
    setValue(newValue)
    return newValue
  }

  return [value, load]
}