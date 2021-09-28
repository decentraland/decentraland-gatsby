import { AjvObjectSchema, AjvSchema } from '../../entities/Schema/types'

export function createObject(
  properties?: Record<string, AjvSchema>,
  required?: string[]
): AjvObjectSchema {
  return {
    type: 'object',
    required,
    properties,
  }
}

export function mergeObjects(obj1: AjvObjectSchema, obj2: AjvObjectSchema) {
  const result: AjvObjectSchema = {
    ...obj1,
    ...obj1,
    properties: {
      ...obj1.properties,
      ...obj2.properties,
    },
  }

  if (obj1.required || obj2.required) {
    result.required = [...(obj1.required || []), ...(obj2.required || [])]
  }

  return result
}

export function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return []
  }

  if (!Array.isArray(value)) {
    return [value]
  }

  return value
}
