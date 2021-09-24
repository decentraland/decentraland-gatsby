module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'jest --bail --watchAll=false --findRelatedTests --passWithNoTests',
    () => 'tsc-files --noEmit',
  ],
  './{src,bin}/**/*.{ts,tsx,js,jsx,json,md,css}': ['prettier --write'],
}