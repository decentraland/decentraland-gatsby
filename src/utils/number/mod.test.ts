import mod from './mod'

test('src/utils/number/mod', () => {
  expect(mod(5, 4)).toBe(1)
  expect(mod(4, 5)).toBe(4)
  expect(mod(5, 5)).toBe(0)
  expect(mod(13, 5)).toBe(3)
  expect(mod(-1, 5)).toBe(4)
  expect(mod(-6, 5)).toBe(4)
})
