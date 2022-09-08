import { uid } from 'radash'

import Router from './Router'

describe(`Router.memo`, () => {
  test(`should call the handle only once per request`, async () => {
    // eslint-disable-next-line no-unused-vars
    const fn = jest.fn(async (_ctx: {}) => uid(24))
    const memorized = Router.memo(fn)

    const request1 = {}
    const request2 = {}

    const value1 = await memorized(request1)
    const value2 = await memorized(request1)
    const value3 = await memorized(request2)
    const value4 = await memorized(request2)

    expect(value1).toBe(value2)
    expect(value1).not.toBe(value3)
    expect(value3).toBe(value4)
    expect(fn.mock.calls.length).toBe(2)
  })
})

// describe(`Router.validator`, () => {
//   test(``, async () => {

//   })
// })

// describe(`Router`, () => {

// })
