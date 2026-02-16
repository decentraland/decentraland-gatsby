/** @type {import('jest').Config} */
const config = {
  globals: {
    fetch: global.fetch,
    Response: global.Response,
    Request: global.Request,
    Headers: global.Headers,
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  roots: ['<rootDir>/src/'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testPathIgnorePatterns: ['\\.integration\\.test\\.'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.github',
    '.husky',
    '.storybook',
    'docs',
    'static',
    'storybook-static',
  ],
  transformIgnorePatterns: ['node_modules/?!(decentraland-dapps|isbot)'],
}

module.exports = config
