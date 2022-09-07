import { uid } from 'radash/dist/random'

import { Request } from '../../Route/wkc/request/Request'
import withBearerToken from './withBearerToken'

describe('withBearerToken', () => {
  const token = uid(24)
  const withAuth = withBearerToken({ tokens: [token] })
  const withAuthOptional = withBearerToken({ tokens: [token], optional: true })

  test(`should fail if the request doesn't have an Authorization header`, async () => {
    const request = new Request('/')
    expect(async () => withAuth({ request })).rejects.toThrowError()
  })

  test(`should fail if the request doesn't use and Bearer autorization`, async () => {
    const request = new Request('/', {
      headers: { authorization: 'Basic user:12345' },
    })

    expect(async () => withAuth({ request })).rejects.toThrowError()
  })

  test(`should fail if the request doesn't use one of the token in params`, async () => {
    const request = new Request('/', {
      headers: { authorization: 'Bearer ' + uid(24) },
    })

    expect(async () => withAuth({ request })).rejects.toThrowError()
  })

  test(`should returns the token used on the authorization`, async () => {
    const request = new Request('/', {
      headers: { authorization: 'Bearer ' + token },
    })

    expect(await withAuth({ request })).toBe(token)
  })

  test(`should return null if the authentication fails but is optional`, async () => {
    const unauthorized = new Request('/')
    const invalidAutorization = new Request('/', {
      headers: { authorization: 'Basic user:12345' },
    })
    const invalidToken = new Request('/', {
      headers: { authorization: 'Bearer ' + uid(24) },
    })
    const validToken = new Request('/', {
      headers: { authorization: 'Bearer ' + token },
    })

    expect(await withAuthOptional({ request: unauthorized })).toBe(null)
    expect(await withAuthOptional({ request: invalidAutorization })).toBe(null)
    expect(await withAuthOptional({ request: invalidToken })).toBe(null)
    expect(await withAuthOptional({ request: validToken })).toBe(token)
  })
})
