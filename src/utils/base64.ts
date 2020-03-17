export function toBase64(original: string) {
  if (typeof btoa === 'function') {
    return btoa(original)
  } else {
    return Buffer.from(original, 'utf8').toString('base64')
  }
}

export function fromBase64(encoded: string) {
  if (typeof atob === 'function') {
    return atob(encoded)
  } else {
    return Buffer.from(encoded, 'base64').toString('utf8')
  }
}