import Time from '../../../utils/date/Time'
import {
  IdentitySigner,
  identity,
  signRequest,
} from '../../Development/identity'
import { Logger } from '../../Development/logger'
import RequestError from '../../Route/error'
import { Request } from '../../Route/wkc/request/Request'
import { WithAuth } from '../types'
import withDecentralandAuth, {
  withAuth,
  withAuthOptional,
} from './withDecentralandAuth'

test(`should be compatible with express.Request + auth middleware`, async () => {
  const expressRequestMock: WithAuth = { auth: 'user', authMetadata: {} } as any
  const auth = await withAuth(expressRequestMock)
  expect(auth.address).toBe(expressRequestMock.auth)
  expect(auth.metadata).toBe(expressRequestMock.authMetadata)

  const authOptional = await withAuthOptional(expressRequestMock)
  expect(authOptional?.address).toBe(expressRequestMock.auth)
  expect(authOptional?.metadata).toBe(expressRequestMock.authMetadata)
})

describe('withDecentralandAuth', () => {
  describe('when custom verifyMetadataContent function is sent', () => {
    describe('and it returns true', () => {
      test('should return auth data', async () => {
        const logger = new Logger({}, { disabled: true })
        const request = signRequest(new Request('/'), {
          identity,
          metadata: { signer: 'decentraland-kernel-scene' },
        })

        expect(
          await withDecentralandAuth({ verifyMetadataContent: () => true })({
            request,
            logger,
          })
        ).toEqual({
          address: IdentitySigner.toLowerCase(),
          metadata: { signer: 'decentraland-kernel-scene' },
        })
      })
    })

    describe('and it throws an error', () => {
      test('should fail', async () => {
        const logger = new Logger({}, { disabled: true })
        const request = signRequest(new Request('/'), {
          identity,
          metadata: { signer: 'decentraland-kernel-scene' },
        })

        await expect(async () =>
          withDecentralandAuth({
            verifyMetadataContent: () => {
              throw new RequestError('error', 400)
            },
          })({
            request,
            logger,
          })
        ).rejects.toThrow('error')
      })
    })
  })
})

describe(`withAuth`, () => {
  test(`should fail for unauthenticated requests`, async () => {
    const request = new Request('/')
    const logger = new Logger({}, { disabled: true })
    await expect(() => withAuth({ request, logger })).rejects.toThrow(
      'Invalid Auth Chain'
    )
  })

  test(`should fail for expired requests`, async () => {
    const logger = new Logger({}, { disabled: true })
    const errors = jest.spyOn(logger, 'error')
    errors.mockImplementation(() => null)
    const request = signRequest(new Request('/'), {
      identity,
      timestamp: Time.utc().subtract(100, 'years').getTime(),
    })

    await expect(() => withAuth({ request, logger })).rejects.toThrow(
      'Expired signature'
    )
  })

  test('should fail for requests with an invalid signer', async () => {
    const logger = new Logger({}, { disabled: true })
    const errors = jest.spyOn(logger, 'error')
    errors.mockImplementation(() => null)
    const request = signRequest(new Request('/'), {
      identity,
      metadata: { signer: 'decentraland-kernel-scene' },
    })

    await expect(() => withAuth({ request, logger })).rejects.toThrow(
      'Invalid signer'
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
    const logger = new Logger({}, { disabled: true })
    expect(await withAuthOptional({ request, logger })).toBe(null)
  })
  test(`should return null for expired requests`, async () => {
    const logger = new Logger({}, { disabled: true })
    const request = signRequest(new Request('/'), {
      identity,
      timestamp: Time.utc().subtract(100, 'years').getTime(),
    })
    expect(await withAuthOptional({ request, logger })).toBe(null)
  })

  test('should return null for requests with an invalid signer', async () => {
    const logger = new Logger({}, { disabled: true })
    const request = signRequest(new Request('/'), {
      identity,
      metadata: { signer: 'decentraland-kernel-scene' },
    })

    expect(await withAuthOptional({ request, logger })).toBe(null)
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
