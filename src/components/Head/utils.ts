
/**
 * Extract the extension from a file path
 * 
 * @example `assert.equal(extension("./file.html"), "html")`
 * @example `assert.equal(extension("./file.html?query"), "html")`
 * @example `assert.equal(extension("./file.min.js?query"), "js")`
 */
export function extension(file: string) {
  let questionMarkPosition = file.indexOf('?')
  if (questionMarkPosition >= 0) {
    file = file.slice(0, questionMarkPosition)
  }

  let dotPosition = file.lastIndexOf('.');
  if (dotPosition >= 0) {
    return file.slice(dotPosition + 1)
  }

  return null
}
