export default function roundRobin<T>(items: T[]) {
  if (items.length === 0) {
    throw new Error(`Round Robin required at least 1 item`)
  }

  let current = 0
  return function roundRobinGetter() {
    const result = items[current]
    current = current === items.length - 1 ? 0 : current + 1
    return result
  }
}
