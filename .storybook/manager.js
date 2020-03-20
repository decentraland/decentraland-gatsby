import { addons } from '@storybook/addons'
import { create } from '@storybook/theming/create'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Gatsby | Decentraland',
    brandUrl: 'https://decentraland.org',
    brandImage: 'https://ui.decentraland.org/color_dark_text.png',
  }),
})
