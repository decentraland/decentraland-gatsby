export type AjvSchema =
  | AjvBooleanSchema
  | AjvEnumSchema
  | AjvOperatorSchema
  | AjvNamedSchema

export type AjvEnumSchema = {
  enum: any[] | readonly any[]
}

export type AjvOperatorSchema = {
  // not?: AjvSchema[] | AjvSchema
  // allOf?: AjvSchema[]
  oneOf?: AjvSchema[]
  anyOf?: AjvSchema[]
  description?: string
  default?: any
}

export type AjvNamedSchema =
  | AjvObjectSchema
  | AjvNumberSchema
  | AjvStringSchema
  | AjvBooleanSchema
  | AjvNullSchema
  | AjvArraySchema
  | AjvMultiSchmea

export type AjvObjectSchema = AjvOperatorSchema & {
  type: 'object'
  additionalProperties?: boolean
  maxProperties?: boolean
  minProperties?: boolean
  required?: string[] | readonly string[]
  properties?: Record<string, AjvSchema>
  patternProperties?: Record<string, AjvSchema>
  dependentRequired?: Record<string, string[]>
  dependentSchemas?: Record<string, { properties: Record<string, AjvSchema> }>
  unevaluatedProperties?: Record<string, string>
  discriminator?: { propertyName: string }
}

export type AjvNumberSchema = AjvOperatorSchema & {
  type: 'number' | 'integer'
  maximum?: number
  minimum?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
  multipleOf?: number
}

export type AjvStringSchema = AjvOperatorSchema & {
  type: 'string'
  format?: string
  minLength?: number
  maxLength?: number
  pattern?: string
}

export type AjvArraySchema = AjvOperatorSchema & {
  type: 'array'
  uniqueItems?: boolean
  additionalItems?: boolean
  unevaluatedItems?: boolean
  maxItems?: number
  minItems?: number
  items?: AjvSchema | AjvSchema[]
  contains?: AjvSchema | AjvSchema[]
  maxContains?: number
  minContains?: number
}

export type AjvBooleanSchema = AjvOperatorSchema & {
  type: 'boolean'
}

export type AjvNullSchema = AjvOperatorSchema & {
  type: 'null'
}

export type AjvMultiSchmea = {
  type: (
    | AjvNullSchema['type']
    | AjvObjectSchema['type']
    | AjvNumberSchema['type']
    | AjvStringSchema['type']
    | AjvArraySchema['type']
    | AjvBooleanSchema['type']
  )[]
} & Omit<AjvNullSchema, 'type'> &
  Omit<AjvObjectSchema, 'type'> &
  Omit<AjvNumberSchema, 'type'> &
  Omit<AjvStringSchema, 'type'> &
  Omit<AjvArraySchema, 'type'> &
  Omit<AjvBooleanSchema, 'type'>

export const FalsyEnum = [false, 0, '0', 'false'] as const
export const TruthyEnum = [true, 1, '1', 'true'] as const
export const BooleanEnum = [...TruthyEnum, ...FalsyEnum] as const

export const apiResultSchema = (data: AjvSchema): AjvObjectSchema => ({
  type: 'object',
  properties: {
    ok: {
      type: 'boolean',
      description: 'Define where the request was completed',
    },
    data,
  },
})

export const timePropertiesSchema = (
  name: string = 'record'
): Record<'created_at' | 'update_at', AjvSchema> => ({
  created_at: {
    type: 'string',
    format: 'data-time',
    description: `The time the ${name} was created`,
  },
  update_at: {
    type: 'string',
    format: 'data-time',
    description: `The time the ${name} was last updated`,
  },
})
