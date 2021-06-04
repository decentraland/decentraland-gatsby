import range from './range'

test('utils/iterator/range', () => {
  expect(Array.from(range(0, 5))).toEqual([0, 1, 2, 3, 4])
  expect(Array.from(range(0, 5, 2))).toEqual([0, 2, 4])
  expect(Array.from(range(0, -5))).toEqual([0, -1, -2, -3, -4])
  expect(Array.from(range(0, -5, 2))).toEqual([0, -2, -4])
  expect(Array.from(range(0, 12345, 500))).toEqual([
    0,
    500,
    1000,
    1500,
    2000,
    2500,
    3000,
    3500,
    4000,
    4500,
    5000,
    5500,
    6000,
    6500,
    7000,
    7500,
    8000,
    8500,
    9000,
    9500,
    10000,
    10500,
    11000,
    11500,
    12000,
  ])
})
