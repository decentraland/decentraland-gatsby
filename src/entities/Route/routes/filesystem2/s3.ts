import * as e from 'express'

import logger from '../../../Development/logger'
import RequestError from '../../error'
import handleExpressError from '../../handle/handleExpressError'
import withHttpMetrics from '../../middleware/withHttpMetrics'
import { withLogs } from '../../middleware/withLogs'
import { Response } from './types'

import type { S3 } from 'aws-sdk'

export type S3RouterOptions = {
  /**
   * Bucket Path to th
   * @example `s3://my-bucket/base-path/to/my-dir`
   */
  bucket: string

  /**
   * If file doesn't exists it will continue with the next router
   * @default false
   */
  continueIfNotFound?: boolean

  /**
   * Not found file resopnse, if not set a plain/text response will be
   * provided instead
   */
  notFoundFile?: string

  /**
   *
   * @param res
   * @returns
   */
  overwrite?: (res: Response) => Promise<Response>
}

export default function createS3Router(s3: S3, options: S3RouterOptions) {
  const router = e.Router()
  if (!options.bucket) {
    throw new Error(`Invalid Bucket: it can't be empty`)
  }

  let url: URL
  try {
    url = new URL(options.bucket)
  } catch (err) {
    throw new Error(`Invalid Bucket: ${options.bucket}`)
  }

  if (url.protocol !== 's3:') {
    throw new Error(
      `Invalid Bucket: expected "s3:" protocol but get "${url.protocol}" instead`
    )
  }

  router.use(withLogs())
  router.use(withHttpMetrics({ handler: 's3' }))
  router.use(async (req, res, next) => {
    const basePath = url.pathname.endsWith('/')
      ? url.pathname.slice(0, -1)
      : url.pathname
    const params: S3.HeadObjectRequest = {
      Key: basePath + req.path,
      Bucket: url.host,
    }

    try {
      await s3.headObject(params).promise()
    } catch (err) {
      // const error = new RequestError()
      return handleExpressError(err, req, res)
    }

    s3.getObject(params).createReadStream().pipe(res)
  })

  return router
}

export async function checkS3File(s3: S3, params: S3.HeadObjectRequest) {
  try {
    const data = await s3.headObject(params).promise()
    console.log(data)
    return {}
  } catch (err) {
    if (err.code !== 'NotFound') {
      logger.error(`Error getting file "s3://${params.Bucket}/${params.Key}"`)
    }

    return {
      status: 404,
      headers: {},
      body: Buffer.alloc(0),
    }
  }
}

export async function readS3File(s3: S3, params: S3.HeadObjectRequest) {
  return s3.getObject(params).createReadStream()
}
