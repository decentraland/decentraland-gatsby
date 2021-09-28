import React, { useMemo } from 'react'
import { Table } from 'decentraland-ui/dist/components/Table/Table'
import Code from '../Text/Code'
import type {
  AjvArraySchema,
  AjvEnumSchema,
  AjvNamedSchema,
  AjvNumberSchema,
  AjvObjectSchema,
  AjvSchema,
  AjvStringSchema,
} from '../../entities/Schema/types'

export type RequestTableProps = {
  query?: AjvObjectSchema
  params?: AjvObjectSchema
  body?: AjvObjectSchema
  response?: AjvObjectSchema
}

export default React.memo(function RequestTable({
  params,
  query,
  body,
  response,
}: RequestTableProps) {
  return (
    <Table basic="very">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Place</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {params &&
          params.properties &&
          Object.keys(params.properties).map((key) => {
            return (
              <RequestTableRow
                key={`param::${key}`}
                name={key}
                position="url"
                definition={params!.properties![key]}
                required={params?.required}
              />
            )
          })}
        {query &&
          query.properties &&
          Object.keys(query.properties).map((key) => {
            return (
              <RequestTableRow
                key={`query::${key}`}
                name={key}
                position="qs"
                definition={query!.properties![key]}
                required={query?.required}
              />
            )
          })}
        {body &&
          body.properties &&
          Object.keys(body.properties).map((key) => {
            return (
              <RequestTableRow
                key={`body::${key}`}
                name={key}
                position="body"
                definition={body!.properties![key]}
                required={body?.required}
              />
            )
          })}
        {response &&
          response.properties &&
          Object.keys(response.properties).map((key) => {
            return (
              <RequestTableRow
                key={`response::${key}`}
                name={key}
                position="response"
                definition={response!.properties![key]}
                required={response?.required}
              />
            )
          })}
      </Table.Body>
    </Table>
  )
})

const RequestTableRow = React.memo(
  ({
    name,
    position,
    definition,
    required,
  }: {
    name: string
    position: string
    definition: AjvSchema
    required?: string[]
  }) => {
    const isRequired = (required || []).includes(name)
    const items = useMemo(() => {
      if ((definition as AjvArraySchema).type !== 'array') {
        return []
      }

      const i = (definition as AjvArraySchema).items
      if (!i) {
        return []
      }

      return Array.isArray(i) ? i : [i]
    }, [definition])

    const obj = useMemo(() => {
      if ((definition as AjvObjectSchema).type !== 'object') {
        return null
      }

      return definition as AjvObjectSchema
    }, [definition])

    return (
      <>
        <Table.Row>
          <RequestTableNameCell required={isRequired} name={name} />
          <RequestTableTypeCell definition={definition} />
          <Table.Cell>
            <Code inline>{position}</Code>
          </Table.Cell>
          <RequestTableDescriptionCell
            required={isRequired}
            definition={definition}
          />
        </Table.Row>
        {items.map((item, i) => (
          <RequestTableRow
            key={i}
            name={`${name}[]`}
            position={position}
            definition={item}
          />
        ))}
        {obj?.properties &&
          Object.keys(obj.properties).map((key) => (
            <RequestTableRow
              key={key}
              name={`${name}.${key}`}
              position={position}
              definition={obj.properties![key]}
              required={obj.required}
            />
          ))}
      </>
    )
  }
)

const RequestTableNameCell = React.memo(function ({
  required,
  name,
}: {
  required: boolean
  name: string
}) {
  return (
    <Table.Cell>
      <span style={{ fontWeight: required ? 'bold' : 'normal' }}>
        <Code inline>{name}</Code>
      </span>
    </Table.Cell>
  )
})

const RequestTableTypeCell = React.memo(function ({
  definition,
}: {
  definition: AjvSchema
}) {
  return (
    <Table.Cell>
      <Code inline>
        {(definition as AjvEnumSchema).enum &&
          (definition as AjvEnumSchema).enum
            .map((value) => JSON.stringify(value))
            .join(' | ')}
        {Array.isArray((definition as AjvNamedSchema).type) &&
          ((definition as AjvNamedSchema).type as any).join(' | ')}
        {!Array.isArray((definition as AjvNamedSchema).type) &&
          (definition as AjvNamedSchema).type}
        {(definition as AjvNamedSchema).nullable && ' | null'}
      </Code>
    </Table.Cell>
  )
})

const RequestTableDescriptionCell = React.memo(function ({
  required,
  definition,
}: {
  required: boolean
  definition: AjvSchema
}) {
  return (
    <Table.Cell>
      {(definition as AjvNamedSchema).description || ''}
      {required ? ' [required]' : ''}
      {(definition as AjvNamedSchema).default !== undefined &&
        ` [default: ${JSON.stringify((definition as AjvNamedSchema).default)}]`}
      {(definition as AjvNumberSchema).minimum !== undefined &&
        ` [minimum: ${JSON.stringify(
          (definition as AjvNumberSchema).minimum
        )}]`}
      {(definition as AjvNumberSchema).maximum !== undefined &&
        ` [maximum: ${JSON.stringify(
          (definition as AjvNumberSchema).maximum
        )}]`}
      {(definition as AjvNumberSchema).exclusiveMinimum !== undefined &&
        ` [exclusiveMinimum: ${JSON.stringify(
          (definition as AjvNumberSchema).exclusiveMinimum
        )}]`}
      {(definition as AjvNumberSchema).exclusiveMaximum !== undefined &&
        ` [exclusiveMaximum: ${JSON.stringify(
          (definition as AjvNumberSchema).exclusiveMaximum
        )}]`}
      {(definition as AjvNumberSchema).multipleOf !== undefined &&
        ` [multipleOf: ${JSON.stringify(
          (definition as AjvNumberSchema).multipleOf
        )}]`}
      {(definition as AjvStringSchema).format !== undefined &&
        ` [format: ${JSON.stringify((definition as AjvStringSchema).format)}]`}
      {(definition as AjvStringSchema).minLength !== undefined &&
        ` [minLength: ${JSON.stringify(
          (definition as AjvStringSchema).minLength
        )}]`}
      {(definition as AjvStringSchema).maxLength !== undefined &&
        ` [maxLength: ${JSON.stringify(
          (definition as AjvStringSchema).maxLength
        )}]`}
      {(definition as AjvStringSchema).pattern !== undefined &&
        ` [pattern: ${JSON.stringify(
          (definition as AjvStringSchema).pattern
        )}]`}
      {(definition as AjvArraySchema).uniqueItems !== undefined &&
        ` [uniqueItems: ${JSON.stringify(
          (definition as AjvArraySchema).uniqueItems
        )}]`}
      {(definition as AjvArraySchema).additionalItems !== undefined &&
        ` [additionalItems: ${JSON.stringify(
          (definition as AjvArraySchema).additionalItems
        )}]`}
      {(definition as AjvArraySchema).unevaluatedItems !== undefined &&
        ` [unevaluatedItems: ${JSON.stringify(
          (definition as AjvArraySchema).unevaluatedItems
        )}]`}
      {(definition as AjvArraySchema).minItems !== undefined &&
        ` [minItems: ${JSON.stringify(
          (definition as AjvArraySchema).minItems
        )}]`}
      {(definition as AjvArraySchema).maxItems !== undefined &&
        ` [maxItems: ${JSON.stringify(
          (definition as AjvArraySchema).maxItems
        )}]`}
      {(definition as AjvArraySchema).minContains !== undefined &&
        ` [minContains: ${JSON.stringify(
          (definition as AjvArraySchema).maxContains
        )}]`}
      {(definition as AjvArraySchema).maxContains !== undefined &&
        ` [maxContains: ${JSON.stringify(
          (definition as AjvArraySchema).maxContains
        )}]`}
      {(definition as AjvObjectSchema).additionalProperties !== undefined &&
        ` [additionalProperties: ${JSON.stringify(
          (definition as AjvObjectSchema).additionalProperties
        )}]`}
    </Table.Cell>
  )
})
