import range from './range'

describe('utils/iterator/range', () => {
  test('Should increase between numbers', () => {
    expect(Array.from(range(0, 5))).toEqual([0, 1, 2, 3, 4])
    expect(Array.from(range(0, -5))).toEqual([0, -1, -2, -3, -4])
  })

  test(`Should increase/decrease unsign a diff factor`, () => {

    expect(Array.from(range(0, 5, 2))).toEqual([0, 2, 4])
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

  test(`Should fail if diff is 0`, () => {
    expect(() => Array.from(range(0, 1, 0))).toThrow(`inc param should be different than 0`)
  })
})
