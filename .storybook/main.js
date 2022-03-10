const { resolve } = require('path')
const { readFileSync } = require('fs')
const prettierConfig = JSON.parse(
  readFileSync(resolve(__dirname, '../.prettierrc'), 'utf8')
)

module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx|mdx)'],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config) => {
    config.resolve.fallback.https = false
    config.resolve.fallback.http = false
    config.resolve.fallback.stream = false
    config.resolve.fallback.os = false
    // config.resolve.fallback.url = false
    return config
  },
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-postcss',
    '@storybook/addon-docs',
    '@storybook/addon-viewport/register',
    '@storybook/addon-actions/register',
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          // test: [/\.stories\.jsx?$/], This is default
          include: [resolve(__dirname, '../src')], // You can specify directories
        },
        loaderOptions: {
          prettierConfig,
        },
      },
    },
  ],
}
