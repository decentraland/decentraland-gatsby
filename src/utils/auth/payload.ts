// `createPayload` is only reachable through `dist/verify` in @dcl/crypto-middleware 6.2.0, which is
// not the package's public API — it resolves today because the package has no exports map, but a
// compatible-looking release could reorganize `dist/`. The deep import is isolated here so there is
// one place to change, and 6.3.0 exports it from the root:
//
//   import { createPayload } from '@dcl/crypto-middleware'
//
// While this deep import stands, @dcl/crypto-middleware is pinned exactly in package.json rather
// than carried on a caret: a future 6.x could add an exports map or reorganize `dist/` without
// breaking its own semver, and a range would accept that release. Restore the caret when switching
// to the root export.
//
// eslint-disable-next-line no-restricted-imports
import { createPayload } from '@dcl/crypto-middleware/dist/verify'

/**
 * Builds the payload an auth chain is signed over.
 *
 * Delegates to the middleware that verifies it, so the signing and verifying halves cannot drift —
 * which is the guarantee the 6.x payload format exists to provide. Do not reimplement this.
 *
 * @param method - HTTP method of the request being signed.
 * @param path - Path being signed, without query string.
 * @param timestamp - Signing timestamp, as sent in `x-identity-timestamp`.
 * @param metadata - Serialized metadata, exactly as sent in `x-identity-metadata`.
 * @returns The string to sign.
 */
export default function signedFetchPayload(
  method: string,
  path: string,
  timestamp: string,
  metadata: string
): string {
  return createPayload(method, path, timestamp, metadata)
}
