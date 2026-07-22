import { readFileSync } from 'fs'

import min from 'htmlmin'

import { MetadataOptions } from './types'
import { replaceHelmetMetadata } from './utils'

describe(`src/entities/Gatsby/utils`, () => {
  describe(`replaceHelmetMetadata`, () => {
    const initial = readFileSync(__dirname + '/__data__/initial.html', 'utf8')
    const empty = readFileSync(
      __dirname + '/__data__/expected.empty.html',
      'utf8'
    )
    const injected = readFileSync(
      __dirname + '/__data__/expected.injected.html',
      'utf8'
    )

    test(`should remove title and meta[data-react-helmet] tags`, () => {
      expect(min(replaceHelmetMetadata(initial))).toBe(min(empty))
    })

    test(`should inject new metadata`, () => {
      const meta: Partial<MetadataOptions> = {
        title: 'Injected title',
        description: 'injected description',
        image: 'image',
        'twitter:card': 'summary_large_image',
        url: 'url',
        'og:type': 'website',
      }

      expect(min(replaceHelmetMetadata(initial, meta))).toBe(min(injected))
    })

    describe(`when the image and url values contain HTML-breakout characters`, () => {
      let output: string
      let breakout: string

      beforeEach(() => {
        breakout = `https://a"><script>alert(1)</script><meta name="x`
        output = replaceHelmetMetadata(initial, {
          image: breakout,
          url: breakout,
        })
      })

      it(`should render the injected script as escaped text instead of a live element`, () => {
        expect(output).toContain(`&lt;script&gt;alert(1)&lt;/script&gt;`)
      })

      it(`should not break out of the content attribute with a raw double quote`, () => {
        expect(output).not.toContain(`content="https://a">`)
      })
    })
  })
})
