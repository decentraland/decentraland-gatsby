import { resolve } from 'path'
import { readFileSync } from 'fs'
import type { StorybookConfig } from '@storybook/react-webpack5'
const prettierConfig = JSON.parse(
  readFileSync(resolve(__dirname, '../.prettierrc'), 'utf8')
)

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx|mdx)'],
  staticDirs: ['../static'],
  webpackFinal: async (config) => {
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    // Find the babel-loader rule and update its exclude pattern
    config.module?.rules?.forEach((rule) => {
      if (
        rule &&
        typeof rule === 'object' &&
        rule.test?.toString().includes('jsx')
      ) {
        rule.exclude = /node_modules\/(?!(gatsby|gatsby-script)\/)/
      }
    })

    // Also add a specific rule for gatsby files
    config.module?.rules?.push({
      test: /\.jsx?$/,
      include: [/node_modules\/gatsby/, /node_modules\/gatsby-script/],
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-react'),
              require.resolve('@babel/preset-env'),
            ],
          },
        },
      ],
    })

    config.target = 'web'

    // Mock thirdweb modules that are optional peer dependencies of decentraland-connect
    // These are not needed for Storybook documentation
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      'thirdweb/chains': require.resolve('./thirdweb-mock.js'),
      'thirdweb/wallets': require.resolve('./thirdweb-mock.js'),
      thirdweb: require.resolve('./thirdweb-mock.js'),
    }

    return config
  },

  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    // '@storybook/addon-postcss',
    {
      name: '@storybook/addon-docs',
      options: {
        transcludeMarkdown: true,
      },
    },
    '@storybook/addon-viewport',
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

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  docs: {
    autodocs: true,
  },
}

export default config
