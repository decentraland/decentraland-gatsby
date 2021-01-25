import { parse, HTMLElement } from 'node-html-parser'
import { MetadataOptions } from './types';

export function replaceHelmetMetadata(page: string, options: Partial<MetadataOptions> = {}) {
  const html = parse(page)

  const head = html.querySelector('head')
  head.removeChild(head.querySelector('title'))

  const helmetMetadata = head.querySelectorAll('meta')
    .filter(meta => meta.hasAttribute('data-react-helmet'))

  for (const meta of helmetMetadata) {
    head.removeChild(meta)
  }

  const injected: string[] = []
  for (const name of Object.keys(options)) {
    switch (name) {
      case 'title':
        injected.push(`<title>${options[name]}</title>`)
        injected.push(`<meta name="twitter:title" content="${options[name]}" />`)
        injected.push(`<meta property="og:title" content="${options[name]}" />`)
        break;

      case `description`:
        injected.push(`<meta name="description" content="${options[name]}" />`)
        injected.push(`<meta name="twitter:description" content="${options[name]}" />`)
        injected.push(`<meta property="og:description" content="${options[name]}" />`)
        break;

      case `image`:
        injected.push(`<meta name="twitter:image" content="${options[name]}" />`)
        injected.push(`<meta property="og:image" content="${options[name]}" />`)
        break;

      case `url`:
        injected.push(`<meta property="og:url" content="${options[name]}" />`)
        break;

      default:
        if (name.startsWith('og:')) {
          injected.push(`<meta property="${name}" content="${options[name]}" />`)
        } else {
          injected.push(`<meta name="${name}" content="${options[name]}" />`)
        }
    }
  }

  const metaNodes = parse(injected.join('')).childNodes.map((meta: HTMLElement) => {
    meta.setAttribute('data-react-helmet', 'true')
    return meta
  })

  head.childNodes = [
    ...metaNodes,
    ...head.childNodes
  ]
  return html.toString()
}