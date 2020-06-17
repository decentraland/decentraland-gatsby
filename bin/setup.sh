#!/usr/bin/env bash
mkdir src

npm i -s \
  dotenv \
  express \
  web3x \
  dcl-crypto \
  decentraland-crypto \
  node-pg-migrate \
  isomorphic-fetch \
  nodemon \
  pg \
  ajv \
  body-parser \
  gatsby \
  gatsby-image \
  gatsby-plugin-intl \
  gatsby-plugin-manifest \
  gatsby-plugin-offline \
  gatsby-plugin-react-helmet \
  gatsby-plugin-sass \
  gatsby-plugin-sharp \
  gatsby-plugin-typescript \
  gatsby-source-filesystem \
  gatsby-transformer-sharp \
  validator

npm i -D \
  prettier \
  concurrently \
  @types/validator \
  @types/node \
  @types/isomorphic-fetch \
  @types/express


echo "/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it" > 'gatsby-ssr.js'

echo "/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it" > 'gatsby-node.js'

echo "module.exports = {
  siteMetadata: {
    title: `Decentraland Events`,
    description: `Decentraland Events`,
    author: `@decentraland`,
  },
  proxy: {
    prefix: `/api`,
    url: `http://localhost:4000`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
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
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        // jsxPragma: `jsx`, // defaults to `React`
        allExtensions: true, // defaults to false,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    // `gatsby-plugin-i18n`,
    {
      resolve: `gatsby-plugin-intl`,
      options: {
        // language JSON resource path
        path: `${__dirname}/src/intl`,
        // supported language
        languages: [`en` /*, `es`, `zh` */],
        // language file path
        defaultLanguage: `en`,
        // option to redirect to `/ko` when connecting `/`
        redirect: true,
      },
    },
  ],
}" > 'gatsby-config.js'

echo "/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it" > 'gatsby-browser.js'

echo "{
  \"endOfLine\": \"lf\",
  \"semi\": false,
  \"singleQuote\": false,
  \"tabWidth\": 2,
  \"trailingComma\": \"es5\"
}" > '.prettierrc'

echo ".cache
package.json
package-lock.json
public
node_modules
lib
tsconfig.tsbuildinfo" > '.prettierignore'

echo "lib
public
tmp
node_modules
tsconfig.tsbuildinfo
" >> '.gitignore'


echo '
  npm commands:
'
echo "    \"build\": \"gatsby build && tsc -p .\","
echo "    \"develop\": \"gatsby develop -H 0.0.0.0\","
echo "    \"format\": \"prettier --write \"**/*.{js,jsx,json,md}\"\","
echo "    \"start\": \"concurrently -c blue,green -n SERVER,FRONT \'npm run serve\' \'npm run develop\'\","
echo "    \"serve\": \"DOTENV_CONFIG_PATH=.env.development nodemon --watch src/entities --watch src/server.ts -e ts,json --exec 'ts-node -r dotenv/config.js' src/server\","
echo "    \"clean\": \"gatsby clean\","
echo "    \"migrate\": \"DOTENV_CONFIG_PATH=.env.development ts-node -r dotenv/config.js ./node_modules/node-pg-migrate/bin/node-pg-migrate -j ts -d CONNECTION_STRING\","
echo "    \"production\": \"NODE_ENV=production node lib/server.js\","