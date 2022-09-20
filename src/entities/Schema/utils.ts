export function bool(value: any): boolean | null {
  switch (value) {
    case 1:
    case true:
    case '1':
    case 'true':
    case 'True':
    case 'TRUE':
      return true

    case 0:
    case false:
    case '0':
    case 'false':
    case 'False':
    case 'FALSE':
      return false

    default:
      return null
  }
}

export function numeric(value: any, options?: { min?: number; max?: number }) {
  if (value === '') {
    return null
  }
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null
  }
  value = Number(value)
  if (!Number.isFinite(value)) {
    return null
  }
  if (
    options?.min !== undefined &&
    options?.max !== undefined &&
    options?.max < options.min
  ) {
    throw new Error(
      `Invalid numeric options, min should be lower than max: ${JSON.stringify(
        options
      )}`
    )
  }
  if (options?.min !== undefined && value < options.min) {
    return options.min
  }
  if (options?.max !== undefined && value > options.max) {
    return options.max
  }
  return value
}
