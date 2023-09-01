import { Response } from './types'

const EMPTY_RESPONSE = {
  status: 200,
  headers: {},
  body: Buffer.alloc(0),
}

describe('Response#merge', () => {
  test('should merge multiple', () => {
    const merged = Response.merge(
      EMPTY_RESPONSE,
      { status: 404 },
      { body: Buffer.from('Not Found') },
      {
        headers: {
          'content-type': 'text/plain',
        },
      }
    )
    expect(merged).not.toBe(EMPTY_RESPONSE)
    expect(merged).toEqual({
      status: 404,
      headers: {
        'content-type': 'text/plain',
      },
      body: Buffer.from('Not Found'),
    })
  })
})
