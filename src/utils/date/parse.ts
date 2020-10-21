export default function parse(value: undefined | null | number | string | Date): Date | null {
  if (value === undefined || value === null) {
    return null
  }

  if (value instanceof Date) {
    return value
  }

  const time = typeof value === 'string' ? Date.parse(value) : value
  if (!Number.isFinite(time) || time < 0) {
    return null
  }

  return new Date(time)
}