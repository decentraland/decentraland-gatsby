import Time from '../../../utils/date/Time'
import {
  IdentitySigner,
  identity,
  signRequest,
} from '../../Development/identity'
import { Request } from '../../Route/wkc/request/Request'
import { WithAuth } from '../types'
import { withAuth, withAuthOptional } from './withDecentralandAuth'

test(`should be compatible with express.Request + auth middleware`, async () => {
  const expressRequestMock: WithAuth = { auth: 'user', authMetadata: {} } as any
  const auth = await withAuth(expressRequestMock)
  expect(auth.auth).toBe(expressRequestMock.auth)
  expect(auth.authMetadata).toBe(expressRequestMock.authMetadata)

  const authOptional = await withAuthOptional(expressRequestMock)
  expect(authOptional?.auth).toBe(expressRequestMock.auth)
  expect(authOptional?.authMetadata).toBe(expressRequestMock.authMetadata)
})

describe(`withAuth`, () => {
  test(`should fail for unauthenticated requests`, async () => {
    const request = new Request('/')
    expect(() => withAuth({ request })).rejects.toThrowError(
      new Error('Invalid Auth Chain')
    )
  })

  test(`should fail for expired requests`, async () => {
    const request = signRequest(new Request('/'), {
      identity,
      timestamp: Time.utc().subtract(100, 'years').getTime(),
    })

    expect(() => withAuth({ request })).rejects.toThrowError(
      new Error('Expired signature')
    )
  })

  test(`should return auth data for signed request`, async () => {
    const request = signRequest(new Request('/'), {
      identity,
    })

    expect(await withAuth({ request })).toEqual({
      address: IdentitySigner.toLowerCase(),
      metadata: {},
    })
  })

  test(`should return metadata for signed request`, async () => {
    const metadata = { value: Math.random() }
    const request = signRequest(new Request('/'), {
      identity,
      metadata,
    })

    expect(await withAuth({ request })).toEqual({
      address: IdentitySigner.toLowerCase(),
      metadata,
    })
  })
})

describe(`withAuthOptional`, () => {
  test(`should return null for unauthenticated requests`, async () => {
    const request = new Request('/')
    expect(await withAuthOptional({ request })).toBe(null)
  })
  test(`should return null for expired requests`, async () => {
    const request = signRequest(new Request('/'), {
      identity,
      timestamp: Time.utc().subtract(100, 'years').getTime(),
    })
    expect(await withAuthOptional({ request })).toBe(null)
  })

  test(`should return auth data for signed request`, async () => {
    const request = signRequest(new Request('/'), {
      identity,
    })

    expect(await withAuth({ request })).toEqual({
      address: IdentitySigner.toLowerCase(),
      metadata: {},
    })
  })

  test(`should return metadata for signed request`, async () => {
    const metadata = { value: Math.random() }
    const request = signRequest(new Request('/'), {
      identity,
      metadata,
    })

    expect(await withAuth({ request })).toEqual({
      address: IdentitySigner.toLowerCase(),
      metadata,
    })
  })
})
