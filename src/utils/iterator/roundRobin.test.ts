import roundRobin from './roundRobin'

test('utils/iterator/roundRobin', () => {
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
