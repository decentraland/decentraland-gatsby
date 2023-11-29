import React from 'react'
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
    if (parseInt(React.version) <= 18) {
      config.externals = ['react-dom/client']
    }
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    if (config?.module?.rules?.[2]) {
      ;(config.module.rules[2] as any).exclude = [
        /node_modules\/(?!(gatsby|gatsby-script)\/)/,
      ]
    }
    config.target = 'web'
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
    '@storybook/addon-viewport/register',
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
