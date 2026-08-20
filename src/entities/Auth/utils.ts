import {
  VerifyAuthChainHeadersOptions,
  rejectIfSigner,
} from '@dcl/crypto-middleware'

import RequestError from '../Route/error'

const SCENE_SIGNER = 'decentraland-kernel-scene'
const isNotSceneSigner = rejectIfSigner(SCENE_SIGNER)

/**
 * Refuses requests a scene runtime signed on a visiting player's behalf.
 *
 * Delegates to `rejectIfSigner`, which refuses a `signer` that is not already canonical rather than
 * comparing it. The previous exact-match comparison could be defeated two ways while leaving the
 * signature valid, because the pre-6.0.0 payload folded the metadata and so did not cover its
 * casing: renaming the delivered property to `Signer` made `'signer' in authMetadata` false, and
 * re-casing the value made the `===` false. Either way the check fell through to `return true`.
 *
 * @param authMetadata - Parsed `x-identity-metadata` contents, if any.
 * @returns `true` when the request may proceed.
 * @throws RequestError 400 when the signer is the scene runtime, or is not in canonical form.
 */
export function verifySigner(
  authMetadata: Record<string, any> | undefined
): boolean {
  if (!isNotSceneSigner(authMetadata ?? {})) {
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
