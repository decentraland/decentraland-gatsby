module.exports = {
  plugins: {
    autoprefixer: true,
    cssnano: true,
    'postcss-svg': true,
    'postcss-copy': {
      dest: 'dist/assets',
    },
  },
}
