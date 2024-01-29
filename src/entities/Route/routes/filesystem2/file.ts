import { createHash } from 'crypto'
import { readFile } from 'fs/promises'

import mime from 'mime'

import logger from '../../../Development/logger'
import { createVoidPool } from '../../../Pool/utils'
import { Response } from './types'
import { createHandlerFromResponse, resolvePath } from './utils'

const POOL = createVoidPool({ min: 0, max: 20 })
const FILES = new Map<string | null, Promise<Response<Buffer>>>()

/**
 * Creates an express handler that returns a file from memory
 * @param base absolute path to root
 * @param path relative path to a file from base
 * @param options
 */
export default function file(base: string, path: string) {
  return createHandlerFromResponse(readFileFromMemory(base, path))
}

/**
 * Load a file form disck only once and return its response representation from there every time
 * @param base absolute path to root
 * @param path relative path to a file from base
 * @param options default values of the response
 * @returns response representation of the file
 */
export async function readFileFromMemory(
  base: string,
  path: string
): Promise<Response<Buffer>> {
  const absolutePath = resolvePath(base, path)
  if (!FILES.has(absolutePath)) {
    FILES.set(absolutePath, readFileFromDisk(base, path))
  }

  return FILES.get(absolutePath)!
}

/**
 * Read a file from disk and returns its response representation
 * @param base absolute path to root
 * @param path relative path to a file from base
 * @returns response representation of the file
 */
export async function readFileFromDisk(
  base: string,
  path: string
): Promise<Response<Buffer>> {
  const absolutePath = resolvePath(base, path)
  if (!absolutePath) {
    return createNotFound(path)
  }

  const item = await POOL.acquire()
  try {
    const body = await readFile(absolutePath)
    const etag = await createETag(body)
    POOL.release(item)
    return {
      status: 200,
      headers: {
        'content-type': mime.getType(path) || 'application/octet-stream',
        'content-length': String(body.length),
        etag,
      },
      body,
    }
  } catch (err) {
    logger.error(`Error reading file "${path}": ${err.message}`, err)
    POOL.release(item)
    return createNotFound(path)
  }
}

export function createNotFound(path: string) {
  return {
    status: 404,
    headers: {
      'content-type': mime.getType(path) || 'application/octet-stream',
      'content-length': '0',
      etag: '"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"', // createETag(Buffer.alloc(0))
    },
    body: Buffer.alloc(0),
  }
}

export function createETag(body: Buffer) {
  const hash = createHash('sha256')
  hash.write(body)
  return `"${hash.digest('hex')}"`
}
