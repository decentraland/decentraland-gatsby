import {
  VerifyAuthChainHeadersOptions,
  rejectIfSigner,
} from '@dcl/crypto-middleware'

import RequestError from '../Route/error'

const SCENE_SIGNER = 'decentraland-kernel-scene'
const SIGNER_KEY = 'signer'
const isNotSceneSigner = rejectIfSigner(SCENE_SIGNER)

/**
 * Whether every key folding to `signer` is spelled exactly `signer`.
 *
 * `rejectIfSigner` reads the own `signer` field, so metadata signed as delivered with
 * `{"Signer": ...}` presents no `signer` at all and passes. Under 6.x a scene cannot produce that
 * — the explorer stamps the metadata and the signature binds those bytes — but a differently-cased
 * or duplicated key still leaves the field ambiguous, and which spelling a consumer reads would
 * depend on nothing the guard controls. Refused rather than resolved.
 */
function hasOnlyCanonicalSignerKey(metadata: Record<string, unknown>): boolean {
  return Object.keys(metadata)
    .filter((key) => key.toLowerCase() === SIGNER_KEY)
    .every((key) => key === SIGNER_KEY)
}

/**
 * Refuses requests a scene runtime signed on a visiting player's behalf.
 *
 * Two things are checked. `rejectIfSigner` refuses a `signer` that is not already canonical rather
 * than comparing it, which covers what the signature cannot: a client signing
 * `Decentraland-Kernel-Scene` itself produces a valid signature, so only a gate can refuse it. And
 * the key spelling must be unambiguous, so the field cannot be present under a name the predicate
 * does not read.
 *
 * The previous exact-match comparison could be defeated two ways while leaving the signature valid,
 * because the pre-6.0.0 payload folded the metadata and so did not cover its casing: renaming the
 * delivered property to `Signer` made `'signer' in authMetadata` false, and re-casing the value made
 * the `===` false. Either way the check fell through to `return true`.
 *
 * @param authMetadata - Parsed `x-identity-metadata` contents, if any.
 * @returns `true` when the request may proceed.
 * @throws RequestError 400 when the signer is the scene runtime, is not canonical, or is delivered
 * under a non-canonical or duplicated key.
 */
export function verifySigner(
  authMetadata: Record<string, unknown> | undefined
): boolean {
  const metadata = authMetadata ?? {}
  if (!hasOnlyCanonicalSignerKey(metadata) || !isNotSceneSigner(metadata)) {
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
    // default with undefined and dropped the scene guard entirely. Providing an actual validator
    // still replaces it, which is the documented contract.
    metadataValidator:
      verifyMetadataContent ?? metadataValidator ?? verifySigner,
  }
}
