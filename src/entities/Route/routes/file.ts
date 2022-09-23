import { createHash } from 'crypto'
import { readFile } from 'fs'
import { extname } from 'path'
import { promisify } from 'util'

import { Response } from 'express'

import { DEFAULT_API_HEADERS } from '../handle'
import handleIncommingMessage from '../handle/handleIncommingMessage'

export default function file(
  path: string,
  status = 200,
  options?: {
    defaultHeaders: Record<string, string>
    api: boolean
  }
) {
  let reader: Promise<readonly [Buffer, string]> | null = null
  return handleIncommingMessage(
    async (_, res: Response) => {
      if (!reader) {
        reader = (async () => {
          const data = await readOnce(path)
          const hash = createHash('sha256')
          hash.write(data)
          const etag = hash.digest('hex')
          return [data, etag] as const
        })()
      }

      const [data, etag] = await reader
      return res
        .set('cache-control', 'public, max-age=86400')
        .set('etag', JSON.stringify(etag))
        .type(extname(path))
        .status(status)
        .send(data)
    },
    { defaultHeaders: DEFAULT_API_HEADERS, api: true, ...options }
  )
}

const files = new Map<string, Promise<Buffer>>()
export async function readOnce(path: string) {
  if (!files.has(path)) {
    files.set(
      path,
      promisify(readFile)(path).catch(() => Buffer.alloc(0))
    )
  }

  return files.get(path)!
}
