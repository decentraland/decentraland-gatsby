// TODO(#323): remove on v6, use radash uid instead https://radash-docs.vercel.app/docs/random-uid
import randomNumber from '../number/random'

/** @deprecated use radash uid instead https://radash-docs.vercel.app/docs/random-uid */
export function randomFrom(raw: string, len = 1) {
  return Array.from(Array(len), () => raw[randomNumber(raw.length)]).join('')
}

/** @deprecated use radash uid instead https://radash-docs.vercel.app/docs/random-uid */
export function randomPassword(len = 1) {
  return randomFrom(
    'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()_+-=|[]{};:,./<>?',
    len
  )
}

/** @deprecated use radash uid instead https://radash-docs.vercel.app/docs/random-uid */
export function randomCapitalAlphanumeric(len = 1) {
  return randomFrom(
    'abcdefghijkmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ0123456789',
    len
  )
}

/** @deprecated use radash uid instead https://radash-docs.vercel.app/docs/random-uid */
export function randomAlphanumeric(len = 1) {
  return randomFrom('abcdefghijkmnopqrstuvwxyz0123456789', len)
}

/** @deprecated use radash uid instead https://radash-docs.vercel.app/docs/random-uid */
export function randomHexadecimal(len = 1) {
  return randomFrom('0123456789abcdef', len)
}

/** @deprecated use radash uid instead https://radash-docs.vercel.app/docs/random-uid */
export function randomNumeric(len = 1) {
  return randomFrom('0123456789', len)
}
