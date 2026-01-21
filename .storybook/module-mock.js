// Mock for optional peer dependencies - not needed for Storybook
module.exports = new Proxy(
  {},
  {
    get: function (target, prop) {
      if (prop === '__esModule') return true
      if (prop === 'default') return () => null
      return () => null
    },
  }
)
