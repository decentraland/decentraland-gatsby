import type { JSONSchemaType, SomeJSONSchema } from 'ajv/dist/types/json-schema'

export type ArrayKeywords = Partial<{
  minItems: number
  maxItems: number
  minContains: number
  maxContains: number
  uniqueItems: true
}>

/** Creates a JSON Schema of arrays of the the param */
export function array<Schema extends SomeJSONSchema>(
  schema: Schema
): { type: 'array'; items: Schema }
export function array<
  Schema extends SomeJSONSchema,
  Opt extends ArrayKeywords = {}
>(schema: Schema, options: Opt): { type: 'array'; items: Schema } & Opt
export function array<
  Schema extends SomeJSONSchema,
  Opt extends ArrayKeywords = {}
>(schema: Schema, options?: Opt) {
  return {
    type: 'array' as const,
    items: schema,
    ...options,
  }
}

const ok = {
  type: 'boolean',
  description: 'Define where the request was completed',
} as const

export type ApiSchemaType<
  Schema extends SomeJSONSchema,
  Extra extends Record<string, SomeJSONSchema> = {}
> = {
  type: 'object'
  required: []
  properties: {
    ok: typeof ok
    data: Schema
  } & Extra
}

/** Creates a JSON Schema for an api response */
export function api<Schema extends SomeJSONSchema>(
  data: Schema
): ApiSchemaType<Schema>
export function api<
  Schema extends SomeJSONSchema,
  Extra extends Record<string, SomeJSONSchema> = {}
>(data: Schema, extra: Extra): ApiSchemaType<Schema, Extra>
export function api<
  Schema extends SomeJSONSchema,
  Extra extends Record<string, SomeJSONSchema> = {}
>(data: Schema, extra?: Extra) {
  return {
    type: 'object',
    properties: {
      ok,
      data,
      ...extra,
    },
  }
}

/** Creates a JSON Schema for a context params */
export function params<
  Properties extends Record<string, JSONSchemaType<string>>
>(properties: Properties) {
  return {
    type: 'object' as const,
    required: Object.keys(properties) as (keyof Properties)[],
    additionalItems: true,
    properties,
  }
}

/** Creates a JSON Schema */
function schema<S extends SomeJSONSchema>(schema: S): S {
  return schema
}

export default Object.assign(schema, { array, params, api })
