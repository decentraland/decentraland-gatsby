import randomNumber from '../number/random'

export function randomFrom(raw: string, len = 1) {
  return Array.from(Array(len), () => raw[randomNumber(raw.length)]).join('')
}

export function randomPassword(len = 1) {
  return randomFrom(
    'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()_+-=|[]{};:,./<>?',
    len
  )
}

export function randomCapitalAlphanumeric(len = 1) {
  return randomFrom(
    'abcdefghijkmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ0123456789',
    len
  )
}

export function randomAlphanumeric(len = 1) {
  return randomFrom('abcdefghijkmnopqrstuvwxyz0123456789', len)
}

export function randomHexadecimal(len = 1) {
  return randomFrom('0123456789abcdef', len)
}

export function randomNumeric(len = 1) {
  return randomFrom('0123456789', len)
}
