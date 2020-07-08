import { createHmac } from 'crypto'

export function sign(data: any, secret: string) {
  const str = JSON.stringify(data)
  const signature = hash(str, secret)
  return String(Buffer.from(str, 'utf8').toString('base64') + '.' + signature)
    .replace(/\+/gi, '-')
}

function hash(str: string, secret: string) {
  return createHmac('sha256', secret)
    .update(str)
    .digest('base64');
}

export function decode(data: string) {
  try {
    const [str] = data.split('.')
    const decoded = Buffer.from(str.replace(/-/gi, '+'), 'base64').toString('utf8')
    return JSON.parse(decoded)
  } catch (err) {
    return null
  }
}

export function verify(data: string, secret: string): any {
  try {
    const [str, expectedSignature] = data.replace(/-/gi, '+').split('.')
    const decoded = Buffer.from(str, 'base64').toString('utf8')
    const signature = hash(decoded, secret)
    if (signature !== expectedSignature) {
      return null
    }

    return JSON.parse(decoded)
  } catch (err) {
    return null
  }
}