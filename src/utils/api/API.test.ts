import API from "./API"
import fetch from "../../entities/Development/fetch.test"
import "../../entities/Development/logger.test"

const HTTPBIN_ENDPOINT = process.env.HTTPBIN_ENDPOINT || 'https://httpbin.org'

describe('utils/api/API', () => {

  describe('#catch', () => {
    test('should bypass values for fulfilled Promises', async () => {
      const value = Math.random()
      const result = await API.catch(Promise.resolve(value))
      expect(result).toBe(value)
    })
    test('should return `null` for failed Promises', async () => {
      const result = await API.catch(Promise.reject(new Error))
      expect(result).toBe(null)
    })
  })

  describe('#url', () => {
    test('should return root path from base', () => {
      expect(API.url('')).toBe('/')
      expect(API.url('/path')).toBe('/path/')
      expect(API.url('https://decentraland.org')).toBe('https://decentraland.org/')
      expect(API.url('https://decentraland.org/path')).toBe('https://decentraland.org/path/')
    })

    test('should attach path', () => {
      expect(API.url('https://decentraland.org/path', '')).toBe('https://decentraland.org/path/')
      expect(API.url('https://decentraland.org/path', 'target/path')).toBe('https://decentraland.org/path/target/path')
      expect(API.url('https://decentraland.org/path', '/target/path')).toBe('https://decentraland.org/path/target/path')
      expect(API.url('https://decentraland.org/path', '/target/path?param1=value1')).toBe('https://decentraland.org/path/target/path?param1=value1')
    })

    test('should attach search params', () => {
      // Empty params
      expect(API.url('https://decentraland.org/path', '', {})).toBe('https://decentraland.org/path/')
      expect(API.url('https://decentraland.org/path', 'target/path', {})).toBe('https://decentraland.org/path/target/path')
      expect(API.url('https://decentraland.org/path', '/target/path', {})).toBe('https://decentraland.org/path/target/path')
      expect(API.url('https://decentraland.org/path', '/target/path?param1=value1', {})).toBe('https://decentraland.org/path/target/path?param1=value1')

      // Object params
      expect(API.url('https://decentraland.org/path', '', { param2: 'value2' })).toBe('https://decentraland.org/path/?param2=value2')
      expect(API.url('https://decentraland.org/path', 'target/path', { param2: 'value2' })).toBe('https://decentraland.org/path/target/path?param2=value2')
      expect(API.url('https://decentraland.org/path', '/target/path', { param2: 'value2' })).toBe('https://decentraland.org/path/target/path?param2=value2')
      expect(API.url('https://decentraland.org/path', '/target/path?param1=value1', { param2: 'value2' })).toBe('https://decentraland.org/path/target/path?param1=value1&param2=value2')

      // URL Search Param
      expect(API.url('https://decentraland.org/path', '', new URLSearchParams({ param2: 'value2' }))).toBe('https://decentraland.org/path/?param2=value2')
      expect(API.url('https://decentraland.org/path', 'target/path', new URLSearchParams({ param2: 'value2' }))).toBe('https://decentraland.org/path/target/path?param2=value2')
      expect(API.url('https://decentraland.org/path', '/target/path', new URLSearchParams({ param2: 'value2' }))).toBe('https://decentraland.org/path/target/path?param2=value2')
      expect(API.url('https://decentraland.org/path', '/target/path?param1=value1', new URLSearchParams({ param2: 'value2' }))).toBe('https://decentraland.org/path/target/path?param1=value1&param2=value2')
    })

    test('.fetch(): http get as default method', async () => {
      const api = new API(HTTPBIN_ENDPOINT)
      fetch.once('https://httpbin.org/anything', 200, { response: '{}' })
      await api.fetch('/anything')
      expect(fetch.lastUrl()).toBe('https://httpbin.org/anything')
      expect(fetch.lastOptions()).toEqual({})
    })

    test('.fetch(): http get method', async () => {
      const api = new API(HTTPBIN_ENDPOINT)
      fetch.once('https://httpbin.org/anything', 200, { response: '{}' })
      await api.fetch('/anything', api.options().method('get'))
      expect(fetch.lastUrl()).toBe('https://httpbin.org/anything')
      expect(fetch.lastOptions()).toEqual({ method: 'get' })
    })

    test('.fetch(): http delete method', async () => {
      const api = new API(HTTPBIN_ENDPOINT)
      fetch.once('https://httpbin.org/anything', 200, { response: '{}' })
      await api.fetch('/anything', api.options().method('delete'))
      expect(fetch.lastUrl()).toBe('https://httpbin.org/anything')
      expect(fetch.lastOptions()).toEqual({ method: 'delete' })
    })

    for (const method of [ 'get', 'post', 'put', 'patch', 'delete', 'head', 'options' ]) {
      test(`.fetch(): http ${method} method`, async () => {
        const api = new API(HTTPBIN_ENDPOINT)
        fetch.once('https://httpbin.org/anything', 200, { response: '{}' })
        await api.fetch('/anything', api.options().method(method))
        expect(fetch.lastUrl()).toBe('https://httpbin.org/anything')
        expect(fetch.lastOptions()).toEqual({ method })
      })
    }

  })
})