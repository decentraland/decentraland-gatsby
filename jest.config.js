module.exports = {
  globals: {
    fetch: global.fetch,
    Response: global.Response,
    Request: global.Request,
    Headers: global.Headers,
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  setupFiles: ['<rootDir>/src/storyshots.setup.ts'],
  roots: ['<rootDir>/src/'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
    '^.+\\.mdx?$': '@storybook/addon-docs/jest-transform-mdx',
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss|gif|ttf|eot|svg)$': 'jest-transform-stub',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.github',
    '.husky',
    '.storybook',
    'docs',
    'static',
    'storybook-static',
  ],
}
