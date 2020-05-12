/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import Helmet from "react-helmet"
import { Locale } from "decentraland-ui/dist/components/Language/Language"

export type MetaProps = JSX.IntrinsicElements['meta']

export type HeadProps = React.Props<any> & {
  lang?: Locale
  title?: string
  titleTemplate?: string | null
  defaultTitle?: string | null
  description?: string
  image?: string
  meta: Partial<MetaProperties>
}

export type MetaProperties = {
  // Open Graph props
  'og:title': string
  'og:type': 'article' | 'book' | 'profile' | 'website' | string
  'og:description': string
  'og:url': string
  'og:site_name': string
  'og:video': string
  'og:image': string
  'og:image:width': number
  'og:image:height': number

  // Twitter props
  'twitter:card': 'summary' | 'summary_large_image' | 'player'
  'twitter:site': string
  'twitter:creator': string
  'twitter:title': string
  'twitter:description': string
  'twitter:image': string
  'twitter:image:alt': string
  'twitter:player': string
  'twitter:player:width': number
  'twitter:player:height': number
  'twitter:player:stream': string
}

export default function Head(props: HeadProps) {

  const meta: Partial<MetaProperties> = {
    'og:title': props.title || props.defaultTitle || '',
    'twitter:title': props.title || props.defaultTitle || '',
    'og:description': props.description || '',
    'twitter:description': props.description || '',
    'og:image': props.image || '',
    'twitter:image': props.image || '',
    'twitter:card': 'summary',
    ...props.meta
  }

  return (
    <Helmet
      htmlAttributes={{ lang: props.lang }}
      titleTemplate={props.titleTemplate || ''}
      defaultTitle={props.defaultTitle || ''}
    >
      {props.title && <title>{props.title}</title>}
      {props.description && <meta name="description" content={props.description} />}
      {props.image && <meta name="image" content={props.image} />}

      {Object.keys(meta).filter((name) => Boolean(meta[name])).map((name) => {
        if (name.startsWith('og:')) {
          return <meta key={name} property={name} content={meta[name]} />
        }
        return <meta key={name} name={name} content={meta[name]} />
      })}

      {props.children}
    </Helmet>
  )
}

Head.defaultProps = {
  lang: `en`,
  meta: {},
  title: ``,
  description: ``,
}

