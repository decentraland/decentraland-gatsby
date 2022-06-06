/**
 * Extract the extension from a file path
 *
 * @example `assert.equal(extension("./file.html"), "html")`
 * @example `assert.equal(extension("./file.html?query"), "html")`
 * @example `assert.equal(extension("./file.min.js?query"), "js")`
 */
export function extension(file: string) {
  const questionMarkPosition = file.indexOf('?')
  if (questionMarkPosition >= 0) {
    file = file.slice(0, questionMarkPosition)
  }

  const dotPosition = file.lastIndexOf('.')
  if (dotPosition >= 0) {
    return file.slice(dotPosition + 1)
  }

  return null
}

export function formatDescription(value: string): string {
  value = (value || '').trim()
  const position = value.indexOf(`\n\n`)
  if (position > 0) {
    value = value.slice(0, position).trim()
  }

  return value
}
