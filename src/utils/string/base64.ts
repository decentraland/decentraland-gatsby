export function toBase64(original: string | ArrayBuffer) {
  if (typeof btoa === 'function' && typeof original === 'string') {
    return btoa(original as string)
  } else if (typeof btoa === 'function') {
    return btoa(String.fromCharCode(...new Uint8Array(original as ArrayBuffer)))
  } else if (typeof original === 'string') {
    return Buffer.from(original, 'utf8').toString('base64')
  } else {
    return Buffer.from(original).toString('base64')
  }
}

export function fromBase64(encoded: string) {
  if (typeof atob === 'function') {
    return atob(encoded)
  } else {
    return Buffer.from(encoded, 'base64').toString('utf8')
  }
}

export function fromWebPushKey(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = fromBase64(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}
