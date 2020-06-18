#!/usr/bin/env node
const { resolve } = require('path')
const { sync } = require('glob')
const { mkdirSync, writeFileSync, readFileSync } = require('fs')
const { spawn } = require('child_process')
const { grey, green, red } = require('colors/safe')

function installDevDependencies(modules) {
  return installDependencies(modules, true)
}

function installDependencies(modules, dev) {
  return new Promise((resolve, reject) => {
    console.log()
    console.log(
      grey(`    intalling ${dev ? 'devDependencies' : 'dependencies'}: `)
    )
    console.log()
    modules.forEach(module => console.log(green('        ' + module)))
    console.log()
    const run = spawn(
      'npm',
      ['install', dev ? '-D' : '-s'].concat(modules || []),
      { stdio: 'inherit' }
    )
    run.on('exit', code =>
      code
        ? reject(new Error(`Installation exits with code ${code}`))
        : resolve(0)
    )
  })
}

Promise.resolve()
  .then(() =>
    installDependencies([
      'dotenv',
      'express',
      'web3x',
      'dcl-crypto',
      'decentraland-crypto',
      'node-pg-migrate',
      'isomorphic-fetch',
      'nodemon',
      'pg',
      'ajv',
      'body-parser',
      'gatsby',
      'gatsby-image',
      'gatsby-plugin-intl',
      'gatsby-plugin-manifest',
      'gatsby-plugin-offline',
      'gatsby-plugin-react-helmet',
      'gatsby-plugin-sass',
      'gatsby-plugin-sharp',
      'gatsby-plugin-typescript',
      'gatsby-source-filesystem',
      'gatsby-transformer-sharp',
      'validator',
    ])
  )
  .then(() =>
    installDevDependencies([
      'prettier',
      'concurrently',
      'ts-node',
      '@types/validator',
      '@types/node',
      '@types/isomorphic-fetch',
      '@types/express',
    ])
  )
  .then(() => {
    const pkg = require(resolve(process.cwd(), 'package.json'))
    pkg.scripts = Object.assign(pkg.scripts || {}, {
      build: 'gatsby build && tsc -p .',
      develop: 'gatsby develop -H 0.0.0.0',
      format: 'prettier --write "**/*.{js,jsx,json,md}"',
      start:
        "concurrently -c blue,green -n SERVER,FRONT 'npm run serve' 'npm run develop'",
      serve:
        "DOTENV_CONFIG_PATH=.env.development nodemon --watch src/entities --watch src/server.ts -e ts,json --exec 'ts-node -r dotenv/config.js' src/server",
      clean: 'gatsby clean',
      migrate:
        'DOTENV_CONFIG_PATH=.env.development ts-node -r dotenv/config.js ./node_modules/node-pg-migrate/bin/node-pg-migrate -j ts -d CONNECTION_STRING',
      production: 'NODE_ENV=production node lib/server.js',
      test: 'echo "Write tests! -> https://gatsby.dev/unit-testing" && exit 1',
    })
    writeFileSync(
      resolve(process.cwd(), 'package.json'),
      JSON.stringify(pkg, null, 2)
    )
  })
  .then(() => {
    const templates = __dirname + '/templates'
    const files = sync('**/*', {
      cwd: templates,
      root: templates,
      absolute: false,
      mark: true,
    })

    files.forEach(file => {
      const isDir = file.endsWith('/')
      const target = isDir ? file.slice(0, -1) : file
      console.log(grey('creating'), green(target))

      if (isDir) {
        mkdirSync(resolve(process.cwd(), target))
      } else {
        writeFileSync(
          resolve(process.cwd(), target),
          readFileSync(resolve(templates, target))
        )
      }
    })
  })
  .then(() => {
    console.log('\n', green(`Done! Have a nice day!`, '\n'))
    process.exit(0)
  })
  .catch(err => {
    console.log()
    console.error(red(`    ${err.message}`))
    console.error(
      grey(
        err.stack
          .split('\n')
          .map(line => '    ' + line)
          .join('\n')
      )
    )
    console.log()
    process.exit(1)
  })
