const { resolve } = require('path')
const { readFileSync } = require('fs')
const prettierConfig = JSON.parse(
  readFileSync(resolve(__dirname, '../.prettierrc'), 'utf8')
)

module.exports = {
  stories: ['../src/**/*.stories.@(js|mdx)'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
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
