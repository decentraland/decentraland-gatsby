/**
 * in case you would like to update the rules please update the documentation
 * in formatting sections in here: file://./docs/pages/typescript.md
 */
module.exports = {
  extends: ['@dcl/eslint-config/gatsby'],
  ignorePatterns: ['node_modules/**', 'dist/**', 'build/**', '**/*.d.ts'],
  parserOptions: {
    project: null,
    warnOnUnsupportedTypeScriptVersion: false,
    createDefaultProgram: false,
  },
}
