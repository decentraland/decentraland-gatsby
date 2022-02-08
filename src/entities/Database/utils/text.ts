export function createSearchableMatches(str: string) {
  return str
    .replace(/\W+/gi, ' ')
    .replace(/\w{3,}/gi, (match: string) => {
      if (match.length <= 3) {
        return match
      }

      const extended = match
        .replace(/[A-Z][A-Z]*[a-z]*/g, (upperMatch) => {
          return ' ' + upperMatch
        })
        .trim()

      if (match === extended) {
        return match
      }

      return match + ' ' + extended
    })
    .trim()
}
