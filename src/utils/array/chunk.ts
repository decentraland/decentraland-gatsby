export default function* chuck<T>(arr: T[], size = 1) {
  let current = 0
  const limit = arr.length
  size = Math.max(1, size)
  while (current < limit) {
    yield arr.slice(current, current + size)
    current = current + size
  }
}
