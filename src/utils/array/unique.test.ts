import unique from "./unique"

test('utils/array/unique', () => {
  expect(Array.from(unique([1, 2, 2, 3, 3, 3]))).toEqual([1, 2, 3])
})