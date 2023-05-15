export default function twitterUrl(url: string, text?: string): string {
  url = url.trim()
  const target = new URL('https://twitter.com/intent/tweet')
  target.searchParams.set('hashtags', 'decentraland,socialworld,virtualgames')

  const description: string[] = []
  if (text) {
    description.push(text)
  }

  description.push(url)

  target.searchParams.set('text', description.join(' '))
  return target.toString()
}
