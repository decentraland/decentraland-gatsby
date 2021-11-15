import { dirname } from 'path'
import { flatten } from 'flat'
import { CreatePageArgs, CreateWebpackConfigArgs, Page } from 'gatsby'
import { DecentralandIntlContext, DecentralandIntlPluginOptions } from './types'

const INTL_DEAULT_PATHS = [
  dirname(
    require.resolve(`decentraland-dapps/dist/modules/translation/defaults`)
  ),
  dirname(require.resolve(`../../intl`)),
]

function loadTransaction(path: string, locale: string): Record<string, string> {
  try {
    const messages = require(`${path}/${locale}.json`)
    return flatten(messages)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.error(
        `[decentraland-gatsby-intl] couldn't find file "${path}/${locale}.json"`
      )
    } else {
      console.error(
        `[decentraland-gatsby-intl] error loading file "${path}/${locale}.json": `,
        err
      )
    }

    return {}
  }
}

function loadTransactions(paths: string[], locale: string) {
  let messages: Record<string, string>[] = []
  for (const path of paths) {
    messages.push(loadTransaction(path, locale))
  }

  return Object.assign({}, ...messages)
}

function generatePage(
  page: Page,
  intl: DecentralandIntlContext
): Page<{ intl: DecentralandIntlContext }> {
  const path =
    intl.locale === intl.defaultLocale
      ? page.path
      : `/${intl.locale}${page.path}`
  return {
    ...page,
    path,
    context: {
      ...page.context,
      intl,
    },
  }
}

export function onCreatePage(
  args: CreatePageArgs<{ intl: DecentralandIntlContext }>,
  options: DecentralandIntlPluginOptions
) {
  //Exit if the page has already been processed.
  if (typeof args.page.context?.intl === 'object') {
    return
  }

  const { createPage, deletePage } = args.actions
  const page = { ...args.page }
  const paths = options.paths || []
  const locales = options.locales || ['en']
  const defaultLocale = options.defaultLocale || locales[0] || 'en'

  deletePage(args.page)
  for (const locale of locales) {
    createPage(
      generatePage(page, {
        locale,
        locales,
        defaultLocale,
        messages: loadTransactions([...INTL_DEAULT_PATHS, ...paths], locale),
      })
    )
  }
}
