export default function iter<T>(amount: number, map: (currentIndex: number, maxIndex: number) => T): T[] {
  if (!Number.isFinite(amount) || amount <= 0) {
    return []
  }

  const maxIndex = amount - 1
  return Array.from(
    new Array(amount),
    (_, currentIndex) => map(currentIndex, maxIndex)
  )
}