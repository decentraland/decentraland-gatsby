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

export function numeric(value: number): number
export function numeric(
  value: number,
  options?: { min?: number; max?: number }
): number
export function numeric(
  value: any,
  options?: { min?: number; max?: number }
): number | null {
  if (value === '') {
    return null
  }

  if (typeof value !== 'string' && typeof value !== 'number') {
    return null
  }

  const num = Number(value)
  if (!Number.isFinite(num)) {
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

  if (options?.min !== undefined && num < options.min) {
    return options.min
  }

  if (options?.max !== undefined && num > options.max) {
    return options.max
  }

  return num
}

export function oneOf<T>(value: any, list: readonly T[]): T | null {
  return list.find((item) => item === value) || null
}
