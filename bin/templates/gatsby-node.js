/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const sharp = require('sharp')
sharp.cache(false)
sharp.simd(false)

// You can delete this file if you're not using it
exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    // plugins: [plugins.provide({ Buffer: ['buffer/', 'Buffer'] })],
    resolve: {
      fallback: {
        assert: false,
        crypto: false,
        http: false,
        https: false,
        os: false,
        stream: false,
        util: false,
      },
    },
  })
}
