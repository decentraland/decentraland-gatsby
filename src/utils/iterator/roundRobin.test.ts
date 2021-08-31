import roundRobin from './roundRobin'

describe('utils/iterator/roundRobin', () => {
  test(`should iterate an array infinitely`, () => {
    const randomList = [Math.random(), Math.random(), Math.random()]
    const getRandom = roundRobin(randomList)

    expect(getRandom()).toEqual(randomList[0])
    expect(getRandom()).toEqual(randomList[1])
    expect(getRandom()).toEqual(randomList[2])
    expect(getRandom()).toEqual(randomList[0])
    expect(getRandom()).toEqual(randomList[1])
    expect(getRandom()).toEqual(randomList[2])
    expect(getRandom()).toEqual(randomList[0])
    expect(getRandom()).toEqual(randomList[1])
    expect(getRandom()).toEqual(randomList[2])
    expect(getRandom()).toEqual(randomList[0])
    expect(getRandom()).toEqual(randomList[1])
    expect(getRandom()).toEqual(randomList[2])
  })

  test(`should fail if the array is empty`, () => {
    expect(() => roundRobin([])).toThrow(`Round Robin required at least 1 item`)
  })
})
