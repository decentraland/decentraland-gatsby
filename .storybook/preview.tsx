import React from 'react'
import {
  light as muiLightTheme,
  ThemeProvider,
} from 'decentraland-ui2/dist/theme'
import 'semantic-ui-css/semantic.min.css'
import 'balloon-css/balloon.min.css'
import 'decentraland-ui/src/themes/base-theme.css'
import 'decentraland-ui/src/themes/alternative/light-theme.css'
import '../src/variables.css'

// Set global variables
global.__BASE_PATH__ = ''
global.__PATH_PREFIX__ = ''

// Create a wrapper component that provides both themes
const ThemeWrapper = ({ children }) => {
  return <ThemeProvider theme={muiLightTheme}>{children}</ThemeProvider>
}

// Export decorators to wrap stories with our theme provider
export const decorators = [
  (Story) => (
    <ThemeWrapper>
      <Story />
    </ThemeWrapper>
  ),
]

// Export parameters for Storybook
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
