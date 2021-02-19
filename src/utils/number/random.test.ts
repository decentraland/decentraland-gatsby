import random from './random'

describe('random', () => {

  test(`positive values`, () => {
    const mock = jest.fn(Math.random)
    Math.random = mock

    mock.mockReturnValueOnce(0)
    expect(random(100)).toBe(0)

    mock.mockReturnValueOnce(0.5)
    expect(random(100)).toBe(50)

    mock.mockReturnValueOnce(0.999999)
    expect(random(100)).toBe(99)
  })

  test(`positive ranges`, () => {
    const mock = jest.fn(Math.random)
    Math.random = mock

    mock.mockReturnValueOnce(0)
    expect(random(10, 100)).toBe(10)

    mock.mockReturnValueOnce(0.5)
    expect(random(10, 100)).toBe(55)

    mock.mockReturnValueOnce(0.999999)
    expect(random(10, 100)).toBe(99)
  })

  test(`negative values`, () => {
    const mock = jest.fn(Math.random)
    Math.random = mock

    mock.mockReturnValueOnce(0)
    expect(random(-100)).toBe(0)

    mock.mockReturnValueOnce(0.5)
    expect(random(-100)).toBe(-50)

    mock.mockReturnValueOnce(0.999999)
    expect(random(-100)).toBe(-99)
  })

  test(`negative range`, () => {
    const mock = jest.fn(Math.random)
    Math.random = mock

    mock.mockReturnValueOnce(0)
    expect(random(-10, -100)).toBe(-10)

    mock.mockReturnValueOnce(0)
    expect(random(-100, -10)).toBe(-100)

    mock.mockReturnValueOnce(0.5)
    expect(random(-10, -100)).toBe(-55)
    mock.mockReturnValueOnce(0.5)
    expect(random(-100, -10)).toBe(-55)

    mock.mockReturnValueOnce(0.999999)
    expect(random(-10, -100)).toBe(-99)
    mock.mockReturnValueOnce(0.999999)
    expect(random(-100, -10)).toBe(-11)
  })
})