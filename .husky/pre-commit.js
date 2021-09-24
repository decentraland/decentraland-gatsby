module.exports = {
  '*.{js,jsx,ts,tsx}': [ () => 'tsc-files --noEmit', ],
  './{src,bin}/**/*.{ts,tsx,js,jsx,json,md,css}': ['prettier --write'],
}