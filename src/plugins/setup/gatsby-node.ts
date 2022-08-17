/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
import { CreateWebpackConfigArgs } from 'gatsby'

const BABEL_DEPENDENCIES_LOADER_RULE_TEST = String(/\.(js|mjs)$/)
export const onCreateWebpackConfig = ({
  actions,
  getConfig,
}: CreateWebpackConfigArgs) => {
  const currentConfig = getConfig()
  const babelLoaderRule = currentConfig.module.rules.find(
    (rule: any) => String(rule.test) === BABEL_DEPENDENCIES_LOADER_RULE_TEST
  )

  if (!babelLoaderRule) {
    currentConfig.module.rules = [
      ...currentConfig.module.rules.filter(
        (rule: any) => String(rule.test) !== BABEL_DEPENDENCIES_LOADER_RULE_TEST
      ),
      {
        ...babelLoaderRule,
        exclude: (file: string) => {
          if (typeof file === 'string' && /@noble\/secp256k1/.test(file)) {
            return false
          }

          return true
        },
      },
    ]
  }

  currentConfig.resolve.fallback = {
    assert: false,
    crypto: false,
    http: false,
    https: false,
    os: false,
    stream: false,
    util: false,
  }

  actions.replaceWebpackConfig(currentConfig)
}
