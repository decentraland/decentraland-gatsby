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
