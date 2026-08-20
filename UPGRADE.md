## upgrade to decentraland-gatsby@9

Two breaking changes land together: the signed-fetch payload format and the Node floor.

### Node 22 is now the minimum

`@dcl/crypto-middleware@6` declares `engines.node >= 22.0.0`, so this package does too. Raise your
runtime before upgrading.

Note a pre-existing conflict this makes visible rather than introduces: `decentraland-ui@7.x`, a peer
of `decentraland-dapps`, declares `engines.node: "20"` — a single major rather than a range. Since
`@dcl/crypto-middleware` has required `>= 22` since v5, no Node version satisfies both, so
`--engine-strict` installs already failed before this release regardless of what this package
advertised. Ordinary installs warn and succeed. Resolving it needs `decentraland-ui` to widen its
engine, or `decentraland-dapps` to widen its peer range.

### The signed-fetch payload binds metadata casing

Up to `@dcl/crypto-middleware@5` the signed payload was lowercased in full, so metadata casing fell
outside the signature. It is now joined verbatim:

```
before  (method + ':' + path + ':' + timestamp + ':' + metadata).toLowerCase()
after   method.toLowerCase() + ':' + path.toLowerCase() + ':' + timestamp + ':' + metadata
```

This library both signs and verifies, so it changes on both sides:

- **As a verifier** — callers still signing the old payload are rejected whenever their metadata
  contains an uppercase character.
- **As a signer** — requests this library signs are rejected by services still running
  `@dcl/crypto-middleware@5` or earlier.

**Metadata that is empty or all-lowercase is unaffected**, since folding those bytes is a no-op. If
every call you sign passes `{}` or lowercase-only metadata, nothing needs sequencing. Otherwise
upgrade the services you call before deploying this.

### `verifySigner` is stricter

The default metadata validator now refuses a `signer` that is not already trimmed and lowercase.
Values are never rewritten — a non-canonical one is rejected rather than folded, so what reaches your
handlers is exactly what the client signed.

Key casing is left to the signature: under `@dcl/crypto-middleware@6` the metadata bytes are signed,
so a delivered property name that differs from the one signed no longer verifies.

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
  plugins: [
    require('autoprefixer'),
    require('cssnano'),
    require('postcss-svg'),
  ],
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
