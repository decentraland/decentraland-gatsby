import { AUTH_METADATA_HEADER } from '@dcl/crypto-middleware'

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

/**
 * Signs the canonical scene signer and then delivers a spelling that differs only in case.
 * `signRequest` lowercases the payload before signing, so the signature stays genuinely valid
 * while the header reads differently to `verifySigner`'s strict comparison — which is what lets
 * a scene request pass as a directly user-signed one. Nothing here weakens the signature.
 */
function signSceneRequestDeliveringMixedCase() {
  const request = signRequest(new Request('http://0.0.0.0/'), {
    identity,
    metadata: { signer: 'decentraland-kernel-scene' },
  })
  request.headers.set(
    AUTH_METADATA_HEADER,
    JSON.stringify({ signer: 'Decentraland-Kernel-Scene' })
  )
  return request
}

/**
 * Signs and delivers a whitespace-padded scene signer. Unlike the mixed-case helper above this is
 * not a signature-reuse attack: `signRequest` lowercases the payload but never trims it, so padding
 * changes the signed bytes and cannot be introduced in flight. What these cases pin is the other
 * half of the guard — a padded value used to slip past `verifySigner`'s strict comparison and be
 * read as a directly user-signed request.
 */
function signSceneRequestWithPaddedSigner(signer: string) {
  return signRequest(new Request('http://0.0.0.0/'), {
    identity,
    metadata: { signer },
  })
}

const PADDED_SCENE_SIGNERS: Array<[string, string]> = [
  ['a leading space', ' decentraland-kernel-scene'],
  ['a trailing space', 'decentraland-kernel-scene '],
]

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
  describe('when custom metadataValidator function is sent', () => {
    describe('and it returns true', () => {
      test('should return auth data', async () => {
        const logger = new Logger({}, { disabled: true })
        const request = signRequest(new Request('http://0.0.0.0/'), {
          identity,
          metadata: { signer: 'decentraland-kernel-scene' },
        })

        expect(
          await withDecentralandAuth({ metadataValidator: () => true })({
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
        const request = signRequest(new Request('http://0.0.0.0/'), {
          identity,
          metadata: { signer: 'decentraland-kernel-scene' },
        })

        await expect(async () =>
          withDecentralandAuth({
            metadataValidator: () => {
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

  describe('when the legacy verifyMetadataContent alias is sent', () => {
    test('should forward it to metadataValidator and fail when it throws', async () => {
      const logger = new Logger({}, { disabled: true })
      const request = signRequest(new Request('http://0.0.0.0/'), {
        identity,
        metadata: { signer: 'decentraland-kernel-scene' },
      })

      await expect(async () =>
        withDecentralandAuth({
          verifyMetadataContent: () => {
            throw new RequestError('legacy', 400)
          },
        })({
          request,
          logger,
        })
      ).rejects.toThrow('legacy')
    })
  })
})

describe(`withAuth`, () => {
  test(`should fail for unauthenticated requests`, async () => {
    const request = new Request('http://0.0.0.0/')
    const logger = new Logger({}, { disabled: true })
    await expect(() => withAuth({ request, logger })).rejects.toThrow(
      'Invalid Auth Chain'
    )
  })

  test(`should fail for expired requests`, async () => {
    const logger = new Logger({}, { disabled: true })
    const errors = jest.spyOn(logger, 'error')
    errors.mockImplementation(() => null)
    const request = signRequest(new Request('http://0.0.0.0/'), {
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
    const request = signRequest(new Request('http://0.0.0.0/'), {
      identity,
      metadata: { signer: 'decentraland-kernel-scene' },
    })

    await expect(() => withAuth({ request, logger })).rejects.toThrow(
      'Invalid signer'
    )
  })

  test('should fail when the scene signer is signed but delivered in mixed case', async () => {
    const logger = new Logger({}, { disabled: true })
    const request = signSceneRequestDeliveringMixedCase()

    await expect(() => withAuth({ request, logger })).rejects.toThrow(
      'Invalid chain metadata'
    )
  })

  test.each(PADDED_SCENE_SIGNERS)(
    'should fail when the scene signer is delivered with %s',
    async (_case, signer) => {
      const logger = new Logger({}, { disabled: true })
      const request = signSceneRequestWithPaddedSigner(signer)

      await expect(() => withAuth({ request, logger })).rejects.toThrow(
        'Invalid chain metadata'
      )
    }
  )

  test(`should return auth data for signed request`, async () => {
    const request = signRequest(new Request('http://0.0.0.0/'), {
      identity,
    })

    expect(await withAuth({ request })).toEqual({
      address: IdentitySigner.toLowerCase(),
      metadata: {},
    })
  })

  test(`should return metadata for signed request`, async () => {
    const metadata = { value: Math.random() }
    const request = signRequest(new Request('http://0.0.0.0/'), {
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
    const request = new Request('http://0.0.0.0/')
    const logger = new Logger({}, { disabled: true })
    expect(await withAuthOptional({ request, logger })).toBe(null)
  })
  test(`should return null for expired requests`, async () => {
    const logger = new Logger({}, { disabled: true })
    const request = signRequest(new Request('http://0.0.0.0/'), {
      identity,
      timestamp: Time.utc().subtract(100, 'years').getTime(),
    })
    expect(await withAuthOptional({ request, logger })).toBe(null)
  })

  test('should return null for requests with an invalid signer', async () => {
    const logger = new Logger({}, { disabled: true })
    const request = signRequest(new Request('http://0.0.0.0/'), {
      identity,
      metadata: { signer: 'decentraland-kernel-scene' },
    })

    expect(await withAuthOptional({ request, logger })).toBe(null)
  })

  test('should return null when the scene signer is signed but delivered in mixed case', async () => {
    const logger = new Logger({}, { disabled: true })
    const request = signSceneRequestDeliveringMixedCase()

    expect(await withAuthOptional({ request, logger })).toBe(null)
  })

  test.each(PADDED_SCENE_SIGNERS)(
    'should return null when the scene signer is delivered with %s',
    async (_case, signer) => {
      const logger = new Logger({}, { disabled: true })
      const request = signSceneRequestWithPaddedSigner(signer)

      expect(await withAuthOptional({ request, logger })).toBe(null)
    }
  )

  test(`should return auth data for signed request`, async () => {
    const request = signRequest(new Request('http://0.0.0.0/'), {
      identity,
    })

    expect(await withAuth({ request })).toEqual({
      address: IdentitySigner.toLowerCase(),
      metadata: {},
    })
  })

  test(`should return metadata for signed request`, async () => {
    const metadata = { value: Math.random() }
    const request = signRequest(new Request('http://0.0.0.0/'), {
      identity,
      metadata,
    })

    expect(await withAuth({ request })).toEqual({
      address: IdentitySigner.toLowerCase(),
      metadata,
    })
  })
})
