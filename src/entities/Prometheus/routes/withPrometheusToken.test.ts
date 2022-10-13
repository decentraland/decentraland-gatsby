import { uid } from 'radash/dist/random'

import env, { Env, setupEnv } from '../../../utils/env'
import { Request } from '../../Route/wkc/request/Request'
import withPrometheusToken from './withPrometheusToken'

const withMissingAuth = withPrometheusToken()
setupEnv({ [Env.PRODUCTION]: { PROMETHEUS_BEARER_TOKEN: uid(24) } })

const withAuth = withPrometheusToken()
test(`should fails if authorization is invalid`, async () => {
  const unauthorized = new Request('/')
  const invalidAutorization = new Request('/', {
    headers: { authorization: 'Basic user:12345' },
  })
  const invalidToken = new Request('/', {
    headers: { authorization: 'Bearer ' + uid(24) },
  })

  expect(async () => withAuth({ request: unauthorized })).rejects.toThrowError()
  expect(async () =>
    withAuth({ request: invalidAutorization })
  ).rejects.toThrowError()
  expect(async () => withAuth({ request: invalidToken })).rejects.toThrowError()
})

test(`shoudl return the PROMETHEUS_BEARER_TOKEN if the token is present in headers`, async () => {
  const validToken = new Request('/', {
    headers: {
      authorization: 'Bearer ' + env('PROMETHEUS_BEARER_TOKEN'),
    },
  })

  expect(await withAuth({ request: validToken })).toBe(
    env('PROMETHEUS_BEARER_TOKEN')
  )
})

test(`should return null if PROMETHEUS_BEARER_TOKEN is not present`, async () => {
  const unauthorized = new Request('/')
  const invalidAutorization = new Request('/', {
    headers: { authorization: 'Basic user:12345' },
  })
  const invalidToken = new Request('/', {
    headers: { authorization: 'Bearer ' + uid(24) },
  })
  const validToken = new Request('/', {
    headers: {
      authorization: 'Bearer ' + env('PROMETHEUS_BEARER_TOKEN'),
    },
  })

  expect(await withMissingAuth({ request: unauthorized })).toBe(null)
  expect(await withMissingAuth({ request: invalidAutorization })).toBe(null)
  expect(await withMissingAuth({ request: invalidToken })).toBe(null)
  expect(await withMissingAuth({ request: validToken })).toBe(null)
})
