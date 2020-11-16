import { Response } from 'express'
import { createHash } from 'crypto'
import { readFile } from 'fs'
import { promisify } from 'util'
import { extname } from 'path'
import handle from '../handle';

export default function file(path: string, status: number = 200) {
  let reader: Promise<readonly [Buffer, string]> | null = null
  return handle(async (_, res: Response) => {
    if (!reader) {
      reader = (async () => {
        const data = await promisify(readFile)(path).catch(() => Buffer.alloc(0))
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
  })
}