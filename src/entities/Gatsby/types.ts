export type Proxy = {
  url: string,
  prefix: string,
}

export type MetadataOptions = {
  title: string,
  description: string,
  image: string,
  url: string,
  'twitter:card': 'summary' | 'summary_large_image' | 'app' | 'player',
  'twitter:site': string,
  'twitter:creator': string,
  'og:type': 'website' | 'article' | 'profile',
  'og:site_name': string,
  [name: string]: string | number | boolean
}