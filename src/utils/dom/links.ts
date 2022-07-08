export function isBlankTarget(target?: string | null) {
  return target === '_blank'
}

export function isLocalLink(href?: string | null) {
  return (
    !!href &&
    !href.startsWith('https://') &&
    !href.startsWith('http://') &&
    !href.startsWith('//')
  )
}
