import { fromBase64, toBase64 } from "./base64"

test('src/utils/number/base64', () => {
  const message = 'abcdefghijklmnopqrstuvwxyz'
  const encoded = 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo='
  expect(toBase64(message)).toBe(encoded)
  expect(fromBase64(encoded)).toBe(message)
})