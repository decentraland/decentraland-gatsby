import { uid } from 'radash'

import Router from './Router'

describe(`Router.memo`, () => {
  test(`should call the handle only once per request`, async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fn = jest.fn(async (_ctx: {}) => uid(24))
    const memorized = Router.memo(fn)

    const request1 = {}
    const request2 = {}

    const value1 = await memorized(request1)
    const value2 = await memorized(request1)
    expect(fn.mock.calls.length).toBe(1)
    expect(value1).toBe(value2)

    const value3 = await memorized(request2)
    const value4 = await memorized(request2)
    expect(fn.mock.calls.length).toBe(2)
    expect(value1).not.toBe(value3)
    expect(value3).toBe(value4)
  })
})

describe(`Router.validator`, () => {
  const validate = Router.validator<string>({ type: 'string', minLength: 3 })

  test(`should fails if the object doesn't validates the input`, async () => {
    expect(async () => validate(123)).rejects.toThrow(
      ['Error validating input:', '- must be string {"type":"string"}'].join(
        '\n'
      )
    )
  })

  test(`should return the same input if is valid`, async () => {
    expect(await validate('123')).toBe('123')
  })
})
