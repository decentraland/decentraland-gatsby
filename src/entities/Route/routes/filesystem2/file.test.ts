import { basename } from 'path'

import { createETag, readFileFromDisk, readFileFromMemory } from './file'
import logger from '../../../Development/logger'

const errors = jest.spyOn(logger, 'error')

describe('createETag', () => {
  test(`should create a hash using a buffer`, async () => {
    expect(await createETag(Buffer.alloc(0))).toBe(
      '"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"'
    )

    const text = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
    expect(await createETag(Buffer.from(text))).toBe(
      '"7321348c8894678447b54c888fdbc4e4b825bf4d1eb0cfb27874286a23ea9fd2"'
    )
  })
})

describe(`readFileFromDisk`, () => {
  beforeEach(() => errors.mockReset())

  test(`should read a file from disk`, async () => {
    const file = await readFileFromDisk(__dirname, basename(__filename))
    expect(file.status).toBe(200)
    expect(file.body).toBeInstanceOf(Buffer)
    expect(file.body.length).toBeGreaterThan(0)
    expect(Number(file.headers['content-length'])).toBeGreaterThan(0)
    expect(file.headers['content-type']).toBe('video/mp2t')
    expect(file.headers['etag']).toBe(await createETag(file.body))
  })

  test(`should return not found if the file doesn't exists`, async () => {
    errors.mockImplementation(() => {})
    const file = await readFileFromDisk(
      __dirname,
      basename(__filename) + Math.random()
    )
    expect(file.status).toBe(404)
    expect(file.body).toBeInstanceOf(Buffer)
    expect(file.body.length).toBe(0)
    expect(Number(file.headers['content-length'])).toBe(0)
    expect(file.headers['content-type']).toBe('application/octet-stream')
    expect(file.headers['etag']).toBe(await createETag(file.body))
    expect(errors.mock.calls.length).toBe(1)
  })
})

describe('readFileFromMemory', () => {
  test(`should read a file from disk`, async () => {
    const file = await readFileFromMemory(__dirname, basename(__filename))
    expect(file.status).toBe(200)
    expect(file.body).toBeInstanceOf(Buffer)
    expect(file.body.length).toBeGreaterThan(0)
    expect(Number(file.headers['content-length'])).toBeGreaterThan(0)
    expect(file.headers['content-type']).toBe('video/mp2t')
    expect(file.headers['etag']).toBe(await createETag(file.body))
  })

  test(`should return not found if the file doesn't exists`, async () => {
    const file = await readFileFromMemory(
      __dirname,
      basename(__filename) + Math.random()
    )
    expect(file.status).toBe(404)
    expect(file.body).toBeInstanceOf(Buffer)
    expect(file.body.length).toBe(0)
    expect(Number(file.headers['content-length'])).toBe(0)
    expect(file.headers['content-type']).toBe('application/octet-stream')
    expect(file.headers['etag']).toBe(await createETag(file.body))
  })

  test(`should return the same object for the same path`, async () => {
    const file1 = await readFileFromMemory(__dirname, basename(__filename))
    const file2 = await readFileFromMemory(__dirname, basename(__filename))
    expect(file1).toBe(file2)
  })
})
