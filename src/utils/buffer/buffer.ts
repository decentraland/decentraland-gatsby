import { Buffer } from 'buffer'

if (typeof window !== 'undefined') {
  if (!window.Buffer) {
    window.Buffer = Buffer
  }
}
