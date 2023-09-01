import { Authenticator } from '@dcl/crypto/dist/Authenticator'
import { AuthIdentity, AuthLinkType } from 'dcl-crypto/dist/types'
import {
  AUTH_CHAIN_HEADER_PREFIX,
  AUTH_METADATA_HEADER,
  AUTH_TIMESTAMP_HEADER,
} from 'decentraland-crypto-middleware/lib/types'

export const IdentitySigner = '0xb92702b3EeFB3c2049aEB845B0335b283e11E9c6'

/**
 * identity for private: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
 */
export const identity: AuthIdentity = {
  ephemeralIdentity: {
    address: '0x82d06f74f5f6d29e2638844069D7cA7a1D19626d',
    privateKey:
      '0xae7b860bef793c3043e14bc3882ce35d18d2aaef12de3f3a2d5588ddb9cfdeda',
    publicKey:
      '0x04b15402efebcf4f0a8a9886a24eb0a0cc58b74a36cbf219cdadc37bcc5277ba1113f69ced3969cb4c9e4a3ff38bd3df7b4e2fcec3afd3b90dd651444b7d3297de',
  },
  expiration: new Date('3163-07-02T09:09:48.792Z'),
  authChain: [
    {
      type: AuthLinkType.SIGNER,
      payload: IdentitySigner,
      signature: '',
    },
    {
      type: AuthLinkType.ECDSA_PERSONAL_EPHEMERAL,
      payload:
        'Decentraland Login\nEphemeral address: 0x82d06f74f5f6d29e2638844069D7cA7a1D19626d\nExpiration: 3163-07-02T09:09:48.792Z',
      signature:
        '0x502f2e195e86e5871aa5adc9bb3bc54bb1a991e4b6dd3bc7d8405586f043d0d11671dc03072d7d5a9b5a481724e01606a43a1d8dc48e7997e888166cf8e4a8151c',
    },
  ],
}

export type SignableRequest = Pick<Request, 'url' | 'method'> & {
  headers: Pick<Headers, 'set'>
}

export type SignRequestOptions = {
  identity?: AuthIdentity
  timestamp?: number
  metadata?: Record<string, any>
}

/**
 * Add decentraland headers for a request
 */
export function signRequest<R extends SignableRequest>(
  req: R,
  options: SignRequestOptions = {}
) {
  const method = req.method
  const url = new URL(req.url, 'http://0.0.0.0/')
  const pathname = url.pathname
  const timestamp = String(options.timestamp ?? Date.now())
  const metadata = JSON.stringify(options.metadata ?? {})
  const payload = [method, pathname, timestamp, metadata]
    .join(':')
    .toLowerCase()

  let i = 0
  const auth = Authenticator.signPayload(identity, payload)
  for (const link of auth) {
    req.headers.set(AUTH_CHAIN_HEADER_PREFIX + i++, JSON.stringify(link))
  }

  req.headers.set(AUTH_TIMESTAMP_HEADER, timestamp)
  req.headers.set(AUTH_METADATA_HEADER, metadata)

  return req
}
