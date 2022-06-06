# ESLint and plugins install and configuration process

The following will describe the steps to install ESLint and all the necessary plugins to be able to order the imports and also to make use of ESLint's functionalities.

## Install and config steps

First needed packages are

```bash
npm i --save-dev eslint
npm i --save-dev @typescript-eslint/parser
npm i --save-dev @typescript-eslint/eslint-plugin
npm i --save-dev prettier
npm i --save-dev eslint-config-prettier
npm i --save-dev eslint-plugin-prettier
```

_To avoid conflicts and to see the progress of the installations, the packages were installed one by one, and in the case of `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` we installed the specific versions 4_

With the installation of these packages we will need the `.eslintrc.js` file with the following base configuration

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {},
}
```

The next recommended step is to try to run ESLint to identify if there are any errors or warnings prior to installing the following packages, and if this is the case they can be fixed before proceeding. To do this, add the following scripts inside `package.json` and then run `npm run lint:fix`

```
  "lint": "eslint --ext '*.{ts,tsx,js,jsx}' ./src",
  "lint:fix": "npm run lint -- --fix"
```

The next step is to install the necessary plugins to order the imports, and the [resolvers](https://github.com/import-js/eslint-plugin-import/wiki/Resolvers) according to each project.

```
eslint-plugin-import
eslint-plugin-css-import-order
eslint-plugin-autofix

eslint-import-resolver-babel-module
eslint-import-resolver-jest
eslint-import-resolver-typescript
```

Finalmente, hay que modificar la configuracion en el archivo `.eslintrc.js`

```javascript
module.exports = {
  ...
  plugins: [
    ...
    'import',
    'autofix',
    'css-import-order',
  ],
  extends: [
    ...
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:css-import-order/recommended',
  ],
  rules: {
    'autofix/no-debugger': 'error',
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true, // don't want to sort import lines, use eslint-plugin-import instead
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true,
      },
    ],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['sibling', 'parent'], // <- Relative imports, the sibling and parent types they can be mingled together
          'index',
          'object',
          'type',
          'unknown',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {},
      'babel-module': {},
    },
  },
}
```

## VSCode settings for autosave

To help us trigger the ESLint auto-fix feature in your current working file. Set the file `./vscode/settings.json` with the next config

```
{
  "editor.formatOnSave": false,
  "eslint.validate": [
    "typescript"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.organizeImports": false,
  }
}
```
