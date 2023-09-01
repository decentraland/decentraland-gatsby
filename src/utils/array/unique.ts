// TODO(#323): remove on v6, use radash unique instead https://radash-docs.vercel.app/docs/array-unique
/** @deprecated use radash unique instead https://radash-docs.vercel.app/docs/array-unique  */
export default function* unique<Input, Output = Input>(
  arr: Input[],
  map: (value: Input) => Output = (v) => v as any
) {
  const prev = new Set<Output>()
  for (const values of arr) {
    const output = map(values)
    if (!prev.has(output)) {
      prev.add(output)
      yield output
    }
  }
}
