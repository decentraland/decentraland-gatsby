let size = 0
const map = new WeakMap<{}, number>()

export default function singleton<T extends {}>(value: T): number {
  if (!map.has(value)) {
    map.set(value, size++)
  }

  return map.get(value)!
}
