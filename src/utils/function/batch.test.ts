import batch from './batch'

describe('utils/function/batch', () => {
  test('it should call the batcher function with multiples items', async () => {
    const fun = jest.fn(async () => null)
    const call = batch<number>(fun)
    await Promise.all([call(1), call(2), call(3), call(4)])

    expect(fun.mock.calls).toEqual([[[1, 2, 3, 4]]])
  })

  test('it should split on multiples batches', async () => {
    const fun = jest.fn(async () => null)
    const call = batch<number>(fun, 2)
    await Promise.all([call(1), call(2), call(3), call(4), call(5), call(6)])

    expect(fun.mock.calls).toEqual([[[1, 2]], [[3, 4]], [[5, 6]]])
  })
})
