import chunk from "./chunk"

test('utils/array/chunk', () => {
  expect(Array.from(chunk([1, 2, 3, 4, 5, 6]))).toEqual([[1], [2], [3], [4], [5], [6]])
  expect(Array.from(chunk([1, 2, 3, 4, 5, 6], 2))).toEqual([[1, 2], [3, 4], [5, 6]])
  expect(Array.from(chunk([1, 2, 3, 4, 5, 6], 3))).toEqual([[1, 2, 3], [4, 5, 6]])
  expect(Array.from(chunk([1, 2, 3, 4, 5, 6], 4))).toEqual([[1, 2, 3, 4], [5, 6]])
  expect(Array.from(chunk([1, 2, 3, 4, 5, 6], 5))).toEqual([[1, 2, 3, 4, 5], [6]])
  expect(Array.from(chunk([1, 2, 3, 4, 5, 6], 6))).toEqual([[1, 2, 3, 4, 5, 6]])
  expect(Array.from(chunk([1, 2, 3, 4, 5, 6], 7))).toEqual([[1, 2, 3, 4, 5, 6]])
  expect(Array.from(chunk([1, 2, 3, 4, 5, 6], 10))).toEqual([[1, 2, 3, 4, 5, 6]])
})