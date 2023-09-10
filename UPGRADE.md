## install decentraland-gatsby@5

```bash
npm install gatsby@4 decentraland-gatsby@5
```

## remove deprecated dependencies

```bash
npm rm gatsby-image gatsby-plugin-intl gatsby-plugin-sass
```

and remove `gatsby-plugin-sass` from `gatsby-config`

## update dependencies compatibles with gatsby@4

```bash
npm install \
  gatsby-plugin-image@2 \
  gatsby-plugin-manifest@4 \
  gatsby-plugin-offline@5 \
  gatsby-plugin-react-helmet@5 \
  gatsby-plugin-sharp@4 \
  gatsby-plugin-typescript@4 \
  gatsby-source-filesystem@4 \
  gatsby-transformer-sharp@4 \
  gatsby-plugin-postcss@5 \
  postcss@8 \
  core-js@3 \
  @gatsbyjs/reach-router@1 \
  @reach/router@1 \
  typescript@4 \
  postcss-assets@6 \
  postcss-svg@3 \
  autoprefixer@10 \
  pg@8 \
```

update `gatsby-node.js`

update `gatsby-browser.js`

```ts
import 'core-js/features/set-immediate'
```

use wrapPageElement with

```ts
import { IntlProvider } from 'decentraland-gatsby/dist/plugins/intl'

return <IntlProvider {...props.pageContext.intl}>{element}</IntlProvider>
```

update `gatsby-config.js`

```ts
plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: "gatsby-plugin-sri",
      options: {
        hash: "sha512", // 'sha256', 'sha384' or 'sha512' ('sha512' = default)
        crossorigin: false, // Optional
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Decentraland`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `node_modules/decentraland-gatsby/static/decentraland.svg`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `decentraland-gatsby/dist/plugins/intl`,
      options: {
        // language JSON resource path
        paths: [`${__dirname}/src/intl`],
        // supported language
        locales: [`en` /*, `es`, `zh` */],
        // language file path
        defaultLocale: `en`,
        // option to redirect to `/ko` when connecting `/`
      },
    },
  ],
```

update/create `postcss.config.js`

```js
module.exports = {
  plugins: [require('autoprefixer')],
}
```

replace `@reach/router` with `@gatsbyjs/reach-router`,

replace `gatsby-plugin-intl` with `decentraland-gatsby/dist/plugins/intl`:

update node in `Dockerfile`

```Dockerfile
FROM node:12-alpine
```

for

```Dockerfile
FROM node:16-alpine
```
