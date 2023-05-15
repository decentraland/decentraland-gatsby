export default function facebookUrl(url: string, text?: string): string {
  url = url.trim()
  const target = new URL('https://www.facebook.com/sharer/sharer.php')
  target.searchParams.set('u', url)

  if (text) {
    target.searchParams.set('description', text)
  }

  return target.toString()
}
