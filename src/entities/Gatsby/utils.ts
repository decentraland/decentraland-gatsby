import escaper from 'html-escaper'
import { parse, HTMLElement } from 'node-html-parser'
import { MetadataOptions } from './types'

function escape(text: string): string {
  return escaper.escape(text).replace(/\n+/gi, ' ')
}

export function replaceHelmetMetadata(
  page: string,
  options: Partial<MetadataOptions> = {}
) {
  const html = parse(page)

  const head = html.querySelector('head')
  if (!head) {
    return html.toString()
  }

  const title = head && head.querySelector('title')
  if (title) {
    head.removeChild(title)
  }

  const helmetMetadata = head
    .querySelectorAll('meta')
    .filter((meta) => meta.hasAttribute('data-react-helmet'))

  for (const meta of helmetMetadata) {
    head.removeChild(meta)
  }

  const injected: string[] = []
  for (const name of Object.keys(options)) {
    switch (name) {
      case 'title':
        const title = escape(options[name] || '')
        injected.push(`<title>${title}</title>`)
        injected.push(`<meta name="twitter:title" content="${title}" />`)
        injected.push(`<meta property="og:title" content="${title}" />`)
        break

      case `description`:
        let descriptionValue = (options[name] || '').trim()
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

      case `image`:
        injected.push(
          `<meta name="twitter:image" content="${options[name]}" />`
        )
        injected.push(`<meta property="og:image" content="${options[name]}" />`)
        break

      case `url`:
        injected.push(`<meta name="twitter:url" content="${options[name]}" />`)
        injected.push(`<meta property="og:url" content="${options[name]}" />`)
        break

      default:
        if (name.startsWith('og:')) {
          injected.push(
            `<meta property="${name}" content="${escape(
              String(options[name] ?? '')
            )}" />`
          )
        } else {
          injected.push(
            `<meta name="${name}" content="${escape(
              String(options[name] ?? '')
            )}" />`
          )
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
