/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const sharp = require('sharp')
sharp.cache(false)
sharp.simd(false)

const BABEL_DEPENDENCIES_LOADER_RULE_TEST = String(/\.(js|mjs)$/)
exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const currentConfig = getConfig()
  const babelLoaderRule = currentConfig.module.rules.find(
    (rule) => String(rule.test) === BABEL_DEPENDENCIES_LOADER_RULE_TEST
  )

  if (!babelLoaderRule) {
    currentConfig.module.rules = [
      ...currentConfig.module.rules.filter(
        (rule) => String(rule.test) !== BABEL_DEPENDENCIES_LOADER_RULE_TEST
      ),
      {
        ...babelLoaderRule,
        exclude: (file) => {
          if (/@noble\/secp256k1/.test(file || '')) {
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
