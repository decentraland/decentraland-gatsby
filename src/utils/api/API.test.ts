import env from '../env'
import API from './API'
import '../../entities/Development/logger.test'

const HTTPBIN_ENDPOINT = env('HTTPBIN_ENDPOINT', 'https://httpbin.org')

describe('utils/api/API', () => {
  describe('#catch', () => {
    test('should bypass values for fulfilled Promises', async () => {
      const value = Math.random()
      const result = await API.catch(Promise.resolve(value))
      expect(result).toBe(value)
    })
    test('should return `null` for failed Promises', async () => {
      const result = await API.catch(Promise.reject(new Error()))
      expect(result).toBe(null)
    })
  })

  describe('#searchParams', () => {
    test('should parse primitives values', () => {
      expect(
        API.searchParams({
          string: 'string',
          number: 123456789,
          boolean: false,
          null: null,
          undefined: undefined,
        }).toString()
      ).toBe('string=string&number=123456789&boolean=false')
    })

    test('should parse date values', () => {
      const now = new Date()
      const expectedDate = new URLSearchParams({ now: now.toJSON() })
      const expectedTimestamp = new URLSearchParams({
        now: String(now.getTime()),
      })
      expect(API.searchParams({ now }).toString()).toBe(expectedDate.toString())
      expect(
        API.searchParams({ now }, { dataToTimestamp: true }).toString()
      ).toBe(expectedTimestamp.toString())
    })

    test('should add multiple values for arrays', () => {
      expect(API.searchParams({ id: ['1', '2', '3'] }).toString()).toBe(
        'id=1&id=2&id=3'
      )
    })

    test('should exclude default values', () => {
      expect(
        API.searchParams(
          {
            string: 'string',
            number: 123456789,
            boolean: false,
            null: null,
            undefined: undefined,
          },
          { default: { boolean: false, string: 'string', number: 123 } }
        ).toString()
      ).toBe('number=123456789')
    })
  })

  describe('#fromPagination', () => {
    test(`should convert a page object into an limit/offset one`, () => {
      expect(API.fromPagination({ page: 1 }, { pageSize: 25 })).toEqual({
        limit: 25,
        offset: 0,
      })
      expect(API.fromPagination({ page: 2 }, { pageSize: 25 })).toEqual({
        limit: 25,
        offset: 25,
      })
    })

    test(`should preserv any extra param`, () => {
      const value = Math.random()
      expect(API.fromPagination({ page: 1, value }, { pageSize: 25 })).toEqual({
        value,
        limit: 25,
        offset: 0,
      })
    })
  })

  describe('#url', () => {
    test('should return root path from base', () => {
      expect(API.url('')).toBe('')
      expect(API.url('/path')).toBe('/path')
      expect(API.url('https://decentraland.org')).toBe(
        'https://decentraland.org'
      )
      expect(API.url('https://decentraland.org/path')).toBe(
        'https://decentraland.org/path'
      )
    })

    test('should attach path', () => {
      expect(API.url('/api', '')).toBe('/api')
      expect(API.url('/api', '/path')).toBe('/api/path')
      expect(API.url('https://decentraland.org/path', '')).toBe(
        'https://decentraland.org/path'
      )
      expect(API.url('https://decentraland.org/path', 'target/path')).toBe(
        'https://decentraland.org/path/target/path'
      )
      expect(API.url('https://decentraland.org/path', '/target/path')).toBe(
        'https://decentraland.org/path/target/path'
      )
      expect(
        API.url('https://decentraland.org/path', '/target/path?param1=value1')
      ).toBe('https://decentraland.org/path/target/path?param1=value1')
    })

    test('should attach search params', () => {
      // Empty params
      expect(API.url('https://decentraland.org/path', '', {})).toBe(
        'https://decentraland.org/path'
      )
      expect(API.url('https://decentraland.org/path', 'target/path', {})).toBe(
        'https://decentraland.org/path/target/path'
      )
      expect(API.url('https://decentraland.org/path', '/target/path', {})).toBe(
        'https://decentraland.org/path/target/path'
      )
      expect(
        API.url(
          'https://decentraland.org/path',
          '/target/path?param1=value1',
          {}
        )
      ).toBe('https://decentraland.org/path/target/path?param1=value1')

      // Object params
      expect(
        API.url('https://decentraland.org/path', '', { param2: 'value2' })
      ).toBe('https://decentraland.org/path?param2=value2')
      expect(
        API.url('https://decentraland.org/path', 'target/path', {
          param2: 'value2',
        })
      ).toBe('https://decentraland.org/path/target/path?param2=value2')
      expect(
        API.url('https://decentraland.org/path', '/target/path', {
          param2: 'value2',
        })
      ).toBe('https://decentraland.org/path/target/path?param2=value2')
      expect(
        API.url('https://decentraland.org/path', '/target/path?param1=value1', {
          param2: 'value2',
        })
      ).toBe(
        'https://decentraland.org/path/target/path?param1=value1&param2=value2'
      )

      // URL Search Param
      expect(
        API.url(
          'https://decentraland.org/path',
          '',
          new URLSearchParams({ param2: 'value2' })
        )
      ).toBe('https://decentraland.org/path?param2=value2')
      expect(
        API.url(
          'https://decentraland.org/path',
          'target/path',
          new URLSearchParams({ param2: 'value2' })
        )
      ).toBe('https://decentraland.org/path/target/path?param2=value2')
      expect(
        API.url(
          'https://decentraland.org/path',
          '/target/path',
          new URLSearchParams({ param2: 'value2' })
        )
      ).toBe('https://decentraland.org/path/target/path?param2=value2')
      expect(
        API.url(
          'https://decentraland.org/path',
          '/target/path?param1=value1',
          new URLSearchParams({ param2: 'value2' })
        )
      ).toBe(
        'https://decentraland.org/path/target/path?param1=value1&param2=value2'
      )
    })

    test('.fetch(): http get as default method', async () => {
      const mock = jest.fn(fetch)
      const api = new API(HTTPBIN_ENDPOINT).setFetcher(mock)
      mock.mockResolvedValue(new Response('{}', { status: 200 }))
      await api.fetch('/anything')
      expect(mock.mock.calls.length).toBe(1)
      expect(mock.mock.calls[0]).toEqual(['https://httpbin.org/anything', {}])
    })

    for (const method of [
      'get',
      'post',
      'put',
      'patch',
      'delete',
      'head',
      'options',
    ]) {
      test(`.fetch(): http ${method} method`, async () => {
        const mock = jest.fn(fetch)
        const api = new API(HTTPBIN_ENDPOINT).setFetcher(mock)
        mock.mockResolvedValue(new Response('{}', { status: 200 }))
        await api.fetch('/anything', api.options().method(method))
        expect(mock.mock.calls.length).toBe(1)
        expect(mock.mock.calls[0]).toEqual([
          'https://httpbin.org/anything',
          { method },
        ])
      })
    }
  })
})
