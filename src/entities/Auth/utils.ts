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
 * `rejectIfSigner` refuses a `signer` that is not already canonical rather than comparing it, which
 * covers what the signature cannot: a client signing `Decentraland-Kernel-Scene` itself produces a
 * valid signature, so only a gate can refuse it. Nothing is folded — the value reaching handlers is
 * what was signed.
 *
 * Key casing is left to the signature. The previous exact-match comparison could be defeated by
 * renaming the delivered property to `Signer`, because the pre-6.0.0 payload folded the metadata and
 * so did not cover its casing; `'signer' in authMetadata` was then false and the check fell through.
 * Under 6.x those bytes are signed, so a rename no longer verifies.
 *
 * @param authMetadata - Parsed `x-identity-metadata` contents, if any.
 * @returns `true` when the request may proceed.
 * @throws RequestError 400 when the signer is the scene runtime, or is not in canonical form.
 */
export function verifySigner(
  authMetadata: Record<string, unknown> | undefined
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
  const { verifyMetadataContent, metadataValidator, ...rest } = options
  return {
    ...rest,
    // Coalesced rather than spread over: with `...rest` last, a caller passing
    // `metadataValidator: undefined` — easy to do when options are built dynamically — overwrote the
    // default with undefined and dropped the scene guard entirely.
    //
    // The current option is checked before the deprecated alias, matching the precedence `...rest`
    // gave it, so a stale `verifyMetadataContent` cannot shadow an intended `metadataValidator`.
    metadataValidator:
      metadataValidator ?? verifyMetadataContent ?? verifySigner,
  }
}
