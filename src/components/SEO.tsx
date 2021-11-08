/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { Locale } from 'decentraland-ui/dist/components/Language/Language'

export type MetaProps = JSX.IntrinsicElements['meta']

export type SEOProps = {
  title: string
  titleTemplate?: string | null
  description?: string | null
  twitter?: string | null
  author?: string | null
  lang?: Locale
  preload?: string[]
  meta?: MetaProps[]
}

const DEFAULT_AUTHOR = '@decentraland'
const DEFAULT_DESCRIPTION = ''
const DEFAULT_TITLE_TEMPLATE = '%s | Decentraland'

function useValue(value: string | null | undefined, defaultValue: string) {
  if (value === null) {
    return null
  }

  return value || defaultValue
}

function preloadAs(file: string) {
  const ext = file.slice(file.lastIndexOf('.') + 1)

  switch (ext) {
    case 'aac':
    case 'flac':
    case 'm4a':
    case 'mp3':
    case 'oga':
    case 'wav':
      return 'audio'

    case 'woff2':
      return 'font'

    case 'svg':
    case 'png':
    case 'gif':
    case 'jpg':
    case 'jpeg':
    case 'jfif':
    case 'pjpeg':
    case 'pjp':
    case 'tif':
    case 'tiff':
    case 'apng':
    case 'bmp':
    case 'ico':
    case 'cur':
    case 'webp':
      return 'image'

    case 'js':
      return 'script'

    case 'css':
      return 'style'

    case 'webm':
    case '3gp':
    case 'mp4':
    case 'ogg':
    case 'ogv':
    case 'mov':
      return 'video'

    default:
      return undefined
  }
}

function preloadType(file: string) {
  const ext = file.slice(file.lastIndexOf('.') + 1)

  switch (ext) {
    case 'apng':
      return 'image/apng'

    case 'bmp':
      return 'image/bmp'

    case 'gif':
      return 'image/gif'

    case 'ico':
    case 'cur':
      return 'image/x-icon'

    case 'jpg':
    case 'jpeg':
    case 'jfif':
    case 'pjpeg':
    case 'pjp':
      return 'image/jpeg'

    case 'png':
      return 'image/png'

    case 'svg':
      return 'image/svg+xml'

    case 'tif':
    case 'tiff':
      return 'image/tiff'

    case 'webp':
      return 'image/webp'

    case 'acc':
      return 'audio/acc'

    case 'flac':
      return 'audio/flac'

    case 'mp3':
      return 'audio/mp3'

    case 'm4a':
      return 'audio/mp4'

    case 'oga':
      return 'audio/ogg'

    case 'wav':
      return 'audio/wav'

    case 'woff2':
      return 'font/woff2'

    case 'webm':
      return 'video/webm'

    case 'mp4':
      return 'video/mp4'

    case 'ogg':
      return 'video/ogg'

    case 'mov':
      return 'video/quicktime'

    case 'webm':
      return 'video/webm'

    default:
      return undefined
  }
}

export default function SEO({
  description,
  lang,
  meta,
  title,
  titleTemplate,
  author,
  preload,
}: SEOProps) {
  const currentAuthor = useValue(author, DEFAULT_AUTHOR)
  const currentDescription = useValue(description, DEFAULT_DESCRIPTION)
  const currentTitleTemplate = useValue(titleTemplate, DEFAULT_TITLE_TEMPLATE)
  const currentMeta: MetaProps[] = [
    !currentDescription && {
      name: `description`,
      content: currentDescription,
    },
    !!currentDescription && {
      name: `twitter:description`,
      content: currentDescription,
    },
    !!currentDescription && {
      property: `og:description`,
      content: currentDescription,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      name: `twitter:card`,
      content: `summary`,
    },
    !!currentAuthor && {
      name: `twitter:creator`,
      content: currentAuthor,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    ...(meta || []),
  ].filter<MetaProps>(Boolean as any)

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={currentTitleTemplate || ''}
      meta={currentMeta}
    >
      {(preload || []).map((file) => (
        <link
          key={file}
          rel="preload"
          href={file}
          as={preloadAs(file)}
          type={preloadType(file)}
        />
      ))}
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  preload: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}
