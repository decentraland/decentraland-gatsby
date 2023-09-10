import { uid } from 'radash/dist/random'

import { Request } from '../../Route/wkc/request/Request'
import withBearerToken from './withBearerToken'

const token = uid(24)
const withAuth = withBearerToken({ tokens: [token] })
const withAuthOptional = withBearerToken({ tokens: [token], optional: true })
const withEmptyAuth = withBearerToken({ tokens: [] })
const withEmptyAuthOptional = withBearerToken({ tokens: [], optional: true })

test(`should fail if the request doesn't have an Authorization header`, async () => {
  const request = new Request('/')
  expect(withAuth({ request })).rejects.toThrow()
})

test(`should fail if the request doesn't use and Bearer autorization`, async () => {
  const request = new Request('/', {
    headers: { authorization: 'Basic user:12345' },
  })

  expect(withAuth({ request })).rejects.toThrow()
})

test(`should fail if the request doesn't use one of the token in params`, async () => {
  const request = new Request('/', {
    headers: { authorization: 'Bearer ' + uid(24) },
  })

  expect(withAuth({ request })).rejects.toThrow()
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

test(`should always fails if tokens is empty`, async () => {
  const unauthorized = new Request('/')
  const invalidAutorization = new Request('/', {
    headers: { authorization: 'Basic user:12345' },
  })
  const invalidToken = new Request('/', {
    headers: { authorization: 'Bearer ' + uid(24) },
  })

  expect(withEmptyAuth({ request: unauthorized })).rejects.toThrow()
  expect(withEmptyAuth({ request: invalidAutorization })).rejects.toThrow()
  expect(withEmptyAuth({ request: invalidToken })).rejects.toThrow()
})

test(`should always returns null if tokens is empty but is optional`, async () => {
  const unauthorized = new Request('/')
  const invalidAutorization = new Request('/', {
    headers: { authorization: 'Basic user:12345' },
  })
  const invalidToken = new Request('/', {
    headers: { authorization: 'Bearer ' + uid(24) },
  })

  expect(await withEmptyAuthOptional({ request: unauthorized })).toBe(null)
  expect(await withEmptyAuthOptional({ request: invalidAutorization })).toBe(
    null
  )
  expect(await withEmptyAuthOptional({ request: invalidToken })).toBe(null)
})
