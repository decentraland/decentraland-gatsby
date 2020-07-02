export default function* unique<Input, Output = Input>(
  arr: Input[],
  map: (value: Input) => Output = (v) => v as any
) {
  const prev = new Set<Input>()
  for (const values of arr) {
    if (!prev.has(values)) {
      prev.add(values)
      yield map(values)
    }
  }
}