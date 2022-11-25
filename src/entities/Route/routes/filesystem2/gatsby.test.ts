import { addGastbyCacheHeaders } from './gatsby'
import { Response } from './types'

const BASE_RESPONSE: Response = {
  status: 200,
  headers: {},
  body: Buffer.alloc(0),
}

describe('addGastbyCacheHeaders', () => {
  test(`should add immutable cache for static and webpack generated files`, () => {
    const result = addGastbyCacheHeaders(BASE_RESPONSE, 'static/123456789.js')
    expect(result.headers['cache-control']).toBe(
      'public, max-age=31536000, immutable'
    )
  })

  test(`should add revalidate cache for other files`, () => {
    const result = addGastbyCacheHeaders(BASE_RESPONSE, 'images/logo.png')
    expect(result.headers['cache-control']).toBe(
      'public, max-age=0, must-revalidate'
    )
  })

  test(`should add revalidate cache for not found files`, () => {
    const result = addGastbyCacheHeaders(
      { ...BASE_RESPONSE, status: 404 },
      'static/123456789.js'
    )
    expect(result.headers['cache-control']).toBe(
      'public, max-age=0, must-revalidate'
    )
  })
})
