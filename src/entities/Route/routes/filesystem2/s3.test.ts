import { S3 } from 'aws-sdk'

import { checkS3File } from './s3'

const desc =
  !process.env.AWS_ACCESS_KEY ||
  !process.env.AWS_ACCESS_SECRET ||
  !process.env.AWS_BUCKET_NAME
    ? describe.skip
    : describe

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: process.env.AWS_REGION,
})

desc(`checkS3File`, () => {
  test(`should return a not found response if doesn't exists`, async () => {
    // const result = await checkS3File(s3, {
    //   Bucket: process.env.AWS_BUCKET_NAME!,
    //   Key: 'test.txt',
    //   // Range: '1-4'
    // })

    const result = await checkS3File(s3, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: 'test.txt' + Math.random(),
      // Range: '1-4'
    })

    expect(result.status).toBe(404)
    expect(result.headers).toEqual({})
    expect(result.body).toEqual(Buffer.alloc(0))
    // expect(result).toEqual({})
  })

  test(`should return a request representing the object in the bucket`, async () => {
    // const result = await checkS3File(s3, {
    //   Bucket: process.env.AWS_BUCKET_NAME!,
    //   Key: 'test.txt',
    //   // Range: '1-4'
    // })

    const result = await checkS3File(s3, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: 'test.txt' + Math.random(),
      // Range: '1-4'
    })

    expect(result.status).toBe(404)
    expect(result.headers).toEqual({})
    expect(result.body).toEqual(Buffer.alloc(0))
  })
})
