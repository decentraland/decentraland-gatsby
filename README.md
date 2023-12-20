# Decentraland Gatsby

![Decentraland](https://decentraland.org/og.jpg)

[![Coverage Status](https://coveralls.io/repos/github/decentraland/decentraland-gatsby/badge.svg?branch=master)](https://coveralls.io/github/decentraland/decentraland-gatsby?branch=master)

## Get started

You can use our [project template](https://github.com/decentraland/decentraland-gatsby-template) if you need to create a new repository.

## Node 16?

If you are using node 16 you may need to install `isomorphic-fetch` in order to avoid a `ReferenceError: fetch is not defined`

```bash
  npm install --save isomorphic-fetch
  npm install --save-dev isomorphic-fetch
```

and imported in your `src/server.ts`

```typescript
import 'isomorphic-fetch'
```

## Start project

```bash
  npm start
```

> If it's the first time that you run a decentraland-gatsby project you may run it as sudo in order to create https files

## Project structure

```text
  src/    ............................... source code
    ┃
    ┣  @types/  ......................... typescript custom types
    ┃
    ┣  migrations/  ..................... migrations
    ┃   ┗ [date]-[migration-name].ts .... files created with `npm run migrate`
    ┃
    ┣  components/  ..................... react components
    ┃
    ┣  hooks/  .......................... react hooks
    ┃
    ┣  entities/  ....................... server side entities
    ┃   ┗ [Entity] ...................... entity name
    ┃       ┣ job.ts .................... background handler (runs periodically in without expose an endpoint)
    ┃       ┣ metrics.ts ................ metrics collectors
    ┃       ┣ middleware.ts ............. connect middleware to reuse
    ┃       ┣ model.ts .................. database model
    ┃       ┣ routes.ts ................. express routes
    ┃       ┣ utils.ts .................. entity helper function (should be front compatible)
    ┃       ┗ types.ts .................. entity types (should be front compatible)
    ┃
    ┣  images/      ..................... render image
    ┃
    ┣  intl/        ..................... language files
    ┃   ┗ [en|es|...].json
    ┃
    ┣  pages/ ........................... route files
    ┃   ┣ 404.tsx     ................... not found page
    ┃   ┣ index.tsx   ................... index page
    ┃   ┣ index.css   ................... index styles
    ┃   ┣ [route].tsx ................... page render component
    ┃   ┗ [route].css ................... page styles
    ┃
    ┣  html.js      ..................... gatsby html template
    ┗  server.ts    ..................... server entry point

  static/ ................ gatsby static files

  .env.example ........... environment variables
  .env.development ....... environment variables for development
  .env.staging ........... environment variables for staging
  .env.production ........ environment variables for production

  .gitlab-ci.yml    ...... CI configuration file

  .eslintrc.js      ...... eslint and plugins config file

  .prettierignore   ...... prettier files
  .prettierrc

  Dockerfile     ......... Docker files
  entrypoint.sh  ......... Bash script executed when the container starts

  gatsby-browser.js  ..... gatsby configuration
  gatsby-config.js
  gatsby-node.js
  gatsby-ssr.js

  tsconfig.json   ........ tsconfig default configuration
```

Environment variables

```.env
# ethereum addresses (separated by ,) that return true
# when you use src/entities/Auth/isAdmin.ts
ADMIN_ADDRESSES=

# infura keys (separated by ,) to create providers
# with src/entities/Blockchain/provider#getProvider
INFURA_KEYS=

# connection string to the database
CONNECTION_STRING=

# token bearer token that protects `/metrics`
PROMETHEUS_BEARER_TOKEN=

# build data, exposed at `/status`
IMAGE=

# default endpoint for utils/api/Catalyst
GATSBY_CATALYST_API=

# default endpoint for utils/api/Land
GATSBY_LAND_API=

# supported chains ids (id user login with other network will app will be prompt to change it, ethereum_mainnet as default)
GATSBY_CHAIN_ID=

# default (ethereum)
# GATSBY_CHAIN_ID=1

# production (ethereum, polygon)
# GATSBY_CHAIN_ID=1,137

# test (sepolia, mumbai)
# GATSBY_CHAIN_ID=11155111,80001

# any
# GATSBY_CHAIN_ID=1,3,4,5,42,137,80001,11155111
```

## Project commands

Development

```bash
  npm run migrate create [migration_name]   # create a new migration
  npm run migrate up                        # run all new migrations
  npm run migrate down                      # revert last migration
  npm start        # start the front and the back end development server
  npm run develop  # start the front end development server
  npm run server   # start the back end development server
  npm run format   # apply code formatting
  npm test         # run test
```

Production

```bash
  npm run build       # build end files
  npm run production  # run production server
```

## ESLint and plugins configuration

In order to understand the steps to install ESLint and the plugins needed to order the imports please follow this [link](ESLINT.md)
