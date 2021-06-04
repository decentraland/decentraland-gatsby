import unique from './unique'

test('utils/array/unique', () => {
  expect(Array.from(unique([1, 2, 2]))).toEqual([1, 2])
  expect(
    Array.from(
      unique([{ value: 1 }, { value: 2 }, { value: 2 }], (o) => o.value)
    )
  ).toEqual([1, 2])
})
