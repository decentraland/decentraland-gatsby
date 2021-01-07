import type { Proxy } from './types'

export function proxy(url: string, prefix: string): Proxy;
export function proxy(url: string, prefixes: string[]): Proxy[];
export function proxy(url: string, prefixes: string | string[]): Proxy | Proxy[] {
  if (Array.isArray(prefixes)) {
    return prefixes.map(prefix => proxy(url, prefix))
  } else if (prefixes.endsWith('/*')) {
    return { url, prefix: prefixes.slice(0, -2) }
  } else {
    return { url, prefix: prefixes }
  }
}