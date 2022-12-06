import { addGastbyCacheHeaders, isGatsbyImmutableFile } from './gatsby'
import { Response } from './types'

const BASE_RESPONSE: Response = {
  status: 200,
  headers: {},
  body: Buffer.alloc(0),
}

describe('isGatsbyImmutableFile', () => {
  const cases = {
    '0af33319c19ef5992f4156e0b3bf4bda7c3fc51d-bd4eb205cf4a3eb23407.js.map':
      true,
    '0af33319c19ef5992f4156e0b3bf4bda7c3fc51d-bd4eb205cf4a3eb23407.js': true,
    '548c89a9-6b453bdcfe68fcef35fd.js.LICENSE.txt': true,
    '548c89a9-6b453bdcfe68fcef35fd.js.map': true,
    '548c89a9-6b453bdcfe68fcef35fd.js': true,
    '231-5962730c2123b4dd350b.js.LICENSE.txt': true,
    '231-5962730c2123b4dd350b.js.map': true,
    '231-5962730c2123b4dd350b.js': true,
    'a-0ada1de1f74749e21bd2.js': true,
    'app-180c149dbc01be406e34.js': true,
    'app-180c149dbc01be406e34.js.map': true,
    'app-180c149dbc01be406e34.js.LICENSE.txt': true,
    'component---src-pages-404-tsx-e5255d69e8f547afb1f8.js': true,
    'component---src-pages-404-tsx-e5255d69e8f547afb1f8.js.map': true,
    'component---src-pages-404-tsx-e5255d69e8f547afb1f8.js.LICENSE.txt': true,
    'framework-09a32baae61ef0761f2b.js': true,
    'framework-09a32baae61ef0761f2b.js.map': true,
    'framework-09a32baae61ef0761f2b.js.LICENSE.txt': true,
    'polyfill-f2da43bfc248990ba3cd.js': true,
    'styles.2edd0f252162eb4313b0.css': true,
    'sw.js': false,
    'webpack-runtime-1e1f49c79177f7a7c4fe.js': true,
    'webpack-runtime-1e1f49c79177f7a7c4fe.js.map': true,
    'webpack.stats.json': false,
    'workbox-9cbc1cc6.js': true,
    'workbox-9cbc1cc6.js.map': true,
    'static/brand-icons-65a2fb6d9aaa164b41a039302093995b.ttf': true,
    'static/images/animated/logo.png': true,
    'static/images/logo.png': true,
    'static/123456789.js': true,
    'images/logo.png': false,
    'a.js': false,
    'whitepaper.pdf': false,
  }

  for (const [path, expected] of Object.entries(cases)) {
    test(`file "${path}" should be ${
      expected ? 'immutable' : 'revalidated'
    }`, () => {
      expect(isGatsbyImmutableFile(path)).toBe(expected)
    })
  }
})

describe('addGastbyCacheHeaders', () => {
  test(`should add immutable cache for static and webpack generated files`, () => {
    const result = addGastbyCacheHeaders(BASE_RESPONSE, 'static/123456789.js')
    expect(result.headers['cache-control']).toBe(
      'public, max-age=31536000, immutable'
    )
  })

  test(`should add revalidate cache for other files`, () => {
    const result = addGastbyCacheHeaders(BASE_RESPONSE, 'images/logo.png')
    expect(result.headers['cache-control']).toBe(
      'public, max-age=0, must-revalidate'
    )
  })

  test(`should add revalidate cache for not found files`, () => {
    const result = addGastbyCacheHeaders(
      { ...BASE_RESPONSE, status: 404 },
      'static/123456789.js'
    )
    expect(result.headers['cache-control']).toBe(
      'public, max-age=0, must-revalidate'
    )
  })
})
