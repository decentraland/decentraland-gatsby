import Response from './Response'

describe(`Response.assign`, () => {
  test(`should assing all values to the target response`, () => {
    const target = {}
    const result = Response.assign(
      target,
      { status: 404 },
      { status: 200 },
      { headers: { 'content-type': 'application/text' } },
      { body: 'Hello world!' }
    )

    expect(result).toBe(target)
    expect(result).toEqual({
      status: 200,
      headers: { 'content-type': 'application/text' },
      body: 'Hello world!',
    })
  })

  test(`should preserver headers`, () => {
    const target = {
      status: 200,
      headers: { 'content-type': 'application/text' },
      body: 'Hello world!',
    }

    const result = Response.assign(target, {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
      body: 'Immutable hello world!',
    })

    expect(result).toBe(target)
    expect(result).toEqual({
      status: 200,
      headers: {
        'content-type': 'application/text',
        'cache-control': 'public, max-age=31536000, immutable',
      },
      body: 'Immutable hello world!',
    })
  })
})
