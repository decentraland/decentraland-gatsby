import { VerifyAuthChainHeadersOptions } from '@dcl/crypto-middleware'

import RequestError from '../Route/error'

export function verifySigner(
  authMetadata: Record<string, any> | undefined
): boolean {
  if (
    authMetadata &&
    'signer' in authMetadata &&
    authMetadata.signer === 'decentraland-kernel-scene'
  ) {
    throw new RequestError('Invalid signer', RequestError.BadRequest)
  }
  return true
}

/**
 * Options accepted by the auth helpers. Extends @dcl/crypto-middleware's verify
 * options with the legacy `verifyMetadataContent` name, which was renamed to
 * `metadataValidator` when migrating off decentraland-crypto-middleware.
 */
export type LegacyVerifyAuthChainHeadersOptions =
  VerifyAuthChainHeadersOptions & {
    /**
     * @deprecated renamed to `metadataValidator` in @dcl/crypto-middleware. It
     * is still forwarded to `metadataValidator` for backwards compatibility and
     * will be removed in a future major version.
     */
    verifyMetadataContent?: VerifyAuthChainHeadersOptions['metadataValidator']
  }

/**
 * Builds the options passed to @dcl/crypto-middleware's `verify`, defaulting the
 * metadata validator to {@link verifySigner} and honoring the legacy
 * `verifyMetadataContent` alias so consumers that haven't migrated keep
 * enforcing metadata validation instead of silently dropping it.
 */
export function resolveVerifyOptions(
  options: LegacyVerifyAuthChainHeadersOptions = {}
): VerifyAuthChainHeadersOptions {
  const { verifyMetadataContent, ...rest } = options
  return {
    metadataValidator: verifyMetadataContent ?? verifySigner,
    ...rest,
  }
}
