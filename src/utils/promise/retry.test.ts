import retry from './retry'

describe('src/utils/promise', () => {
  test(`retry`, async () => {
    let i = 0

    const complete = retry(3, async () => {
      return ++i
    })

    await expect(complete).resolves.toBe(1)

    const eventual = retry(3, async () => {
      ++i
      if (i !== 3) {
        throw new Error(`error n: ${i}`)
      } else {
        return i
      }
    })

    await expect(eventual).resolves.toBe(3)

    const failed = retry(3, async () => {
      ++i
      throw new Error(`error n: ${i}`)
    })

    await expect(failed).rejects.toEqual(new Error(`error n: 6`))
  })
})
