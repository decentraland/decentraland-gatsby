// TODO(#323): remove on v6, use radash iterate instead https://radash-docs.vercel.app/docs/array-iterate
export default function iter<T>(
  amount: number,
  map: (currentIndex: number, maxIndex: number) => T
): T[] {
  if (!Number.isFinite(amount) || amount <= 0) {
    return []
  }

  const maxIndex = amount - 1
  return Array.from(new Array(amount), (_, currentIndex) =>
    map(currentIndex, maxIndex)
  )
}
