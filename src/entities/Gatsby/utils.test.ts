import min from 'htmlmin'
import { readFileSync } from 'fs'
import { replaceHelmetMetadata } from './utils'
import { MetadataOptions } from './types'

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
  })
})
