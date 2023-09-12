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
    config.target = 'web'
    return config
  },

  addons: ['@storybook/addon-essentials'],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  docs: {
    autodocs: true,
  },
}

export default config
