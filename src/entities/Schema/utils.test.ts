import { bool, numeric, oneOf } from './utils'

test('bool', () => {
  expect(bool(1)).toBe(true)
  expect(bool(true)).toBe(true)
  expect(bool('1')).toBe(true)
  expect(bool('true')).toBe(true)
  expect(bool('True')).toBe(true)
  expect(bool('TRUE')).toBe(true)
  expect(bool(0)).toBe(false)
  expect(bool(false)).toBe(false)
  expect(bool('0')).toBe(false)
  expect(bool('false')).toBe(false)
  expect(bool('False')).toBe(false)
  expect(bool('FALSE')).toBe(false)
  expect(bool(2)).toBe(null)
  expect(bool(null)).toBe(null)
  expect(bool(undefined)).toBe(null)
  expect(bool(NaN)).toBe(null)
  expect(bool('other')).toBe(null)
})

test('numeric', () => {
  expect(numeric(1)).toBe(1)
  expect(numeric('1')).toBe(1)
  expect(numeric('True')).toBe(null)
  expect(numeric(null)).toBe(null)
  expect(numeric(undefined)).toBe(null)
  expect(numeric(NaN)).toBe(null)
  expect(numeric(5, { max: 2 })).toBe(2)
  expect(numeric(1, { min: 2 })).toBe(2)
  expect(async () => numeric(2, { min: 3, max: 1 })).rejects.toThrowError(
    'Invalid numeric options'
  )
})

test('oneOf', () => {
  expect(oneOf(1, [1, 2, 3, 4, 5, 6])).toBe(1)
  expect(oneOf(10, [1, 2, 3, 4, 5, 6])).toBe(null)
})
