# decentraland-gatsby

Common Gatsby project

## Setup new project

Initialize a new project

```bash
  npm init
```

Install this library as a dependency:

```bash
  npm install -s decentraland-gatsby
```

Run the setup command

```bash
  ./node_modules/.bin/setup
```

## Project structure

```text
  migrations/    ......... migrations
  src/    ................ source code
    ┣  components/  ...... react components
    ┣  entities/    ...... server side entities
    ┣  images/      ...... render image
    ┣  intl/        ...... language files
        ┗ [en|es|...].json

    ┣  pages/       ...... route files
        ┣ 404.tsx     .... not found page
        ┣ index.tsx   .... index page
        ┣ index.css   .... index styles
        ┗ [route].tsx .... page render component
        ┗ [route].css .... page styles

    ┣  html.js      ...... gatsby html template
    ┗  server.ts    ...... server entry point

  static/ ................ gatsby static files

  .gitlab-ci.yml    ...... CI configuration file

  .prettierignore   ...... prettier files
  .prettierrc

  Dockerfile     ......... Docker files
  entrypoint.sh

  gatsby-browser.js  ..... gatsby configuration
  gatsby-config.js
  gatsby-node.js
  gatsby-ssr.js

  tsconfig.json   ........ tsconfig default configuration
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
