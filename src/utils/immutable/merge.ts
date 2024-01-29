export default function merge(
  source: Record<string, any>,
  ...data: Record<string, any>[]
) {
  for (const extra of data) {
    for (const key of Object.keys(extra)) {
      if (source[key] !== extra[key]) {
        source = { ...source, ...extra }
        break
      }
    }
  }

  return source
}
