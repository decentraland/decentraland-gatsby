/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { Locale } from "decentraland-ui/dist/components/Language/Language"

export type MetaProps = JSX.IntrinsicElements['meta']

export type SEOProps = {
  title: string
  titleTemplate?: string | null
  description?: string | null
  twitter?: string | null
  author?: string | null
  lang?: Locale
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

export default function SEO({ description, lang, meta, title, titleTemplate, author }: SEOProps) {

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
    ...meta
  ]
    .filter<MetaProps>(Boolean as any)

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={currentTitleTemplate || ''}
      meta={currentMeta}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}
