import { escape as _escape } from 'html-escaper'
import { HTMLElement, parse } from 'node-html-parser'

import { MetadataOptions } from './types'

function escape(text: string): string {
  return _escape(text).replace(/\n+/gi, ' ')
}

export function createHelmetMetadataReplacer(page: string) {
  const html = parse(page)
  return (metadata: Partial<MetadataOptions> = {}) => {
    const head = html.querySelector('head')
    if (!head) {
      return html.toString()
    }

    if (metadata.title) {
      const title = head && head.querySelector('title')
      if (title) {
        head.removeChild(title)
      }
    }

    const helmetMetadata = head
      .querySelectorAll('meta')
      .filter((meta) => meta.hasAttribute('data-react-helmet'))

    for (const meta of helmetMetadata) {
      head.removeChild(meta)
    }

    const injected: string[] = []
    for (const name of Object.keys(metadata)) {
      switch (name) {
        case 'title': {
          const title = escape(metadata[name] || '')
          injected.push(`<title>${title}</title>`)
          injected.push(`<meta name="twitter:title" content="${title}" />`)
          injected.push(`<meta property="og:title" content="${title}" />`)
          break
        }
        case `description`: {
          let descriptionValue = (metadata[name] || '').trim()
          const descriptionParragraphPosition = descriptionValue.indexOf(`\n\n`)
          if (descriptionParragraphPosition > 0) {
            descriptionValue = descriptionValue
              .slice(0, descriptionParragraphPosition)
              .trim()
          }
          const description = escape(descriptionValue)
          injected.push(`<meta name="description" content="${description}" />`)
          injected.push(
            `<meta name="twitter:description" content="${description}" />`
          )
          injected.push(
            `<meta property="og:description" content="${description}" />`
          )
          break
        }
        case `image`: {
          const image = escape(String(metadata[name] ?? ''))
          injected.push(`<meta name="twitter:image" content="${image}" />`)
          injected.push(`<meta property="og:image" content="${image}" />`)
          break
        }

        case `url`: {
          const url = escape(String(metadata[name] ?? ''))
          injected.push(`<meta name="twitter:url" content="${url}" />`)
          injected.push(`<meta property="og:url" content="${url}" />`)
          break
        }

        default: {
          // The metadata key is interpolated into an attribute too, so it must be
          // escaped as well — an unescaped key could otherwise break out of the
          // `name`/`property` attribute even when the value is safe.
          const key = escape(name)
          const value = escape(String(metadata[name] ?? ''))
          if (name.startsWith('og:')) {
            injected.push(`<meta property="${key}" content="${value}" />`)
          } else {
            injected.push(`<meta name="${key}" content="${value}" />`)
          }
        }
      }
    }

    const metaNodes = parse(injected.join('')).childNodes.map(
      (meta: HTMLElement) => {
        meta.setAttribute('data-react-helmet', 'true')
        return meta
      }
    )

    head.childNodes = [...metaNodes, ...head.childNodes]
    return html.toString()
  }
}

export function replaceHelmetMetadata(
  page: string,
  options: Partial<MetadataOptions> = {}
) {
  return createHelmetMetadataReplacer(page)(options)
}
