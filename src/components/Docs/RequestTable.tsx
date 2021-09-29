import React, { useMemo } from 'react'
import { Table } from 'decentraland-ui/dist/components/Table/Table'
import Code from '../Text/Code'
import type {
  AjvArraySchema,
  AjvEnumSchema,
  AjvNamedSchema,
  AjvObjectSchema,
  AjvOperatorSchema,
  AjvSchema,
  AjvStringSchema,
} from '../../entities/Schema/types'
import { toArray } from './utils'

import './RequestTable.css'

export type RequestTableProps = {
  query?: AjvObjectSchema
  params?: AjvObjectSchema
  header?: AjvObjectSchema
  body?: AjvObjectSchema
}

export default React.memo(function RequestTable({
  params,
  query,
  body,
  header,
}: RequestTableProps) {
  return (
    <Table basic="very" className="RequestTable">
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
        {header &&
          header.properties &&
          Object.keys(header.properties).map((key) => {
            return (
              <RequestTableRow
                key={`header::${key}`}
                name={key}
                position="header"
                definition={header!.properties![key]}
                required={header?.required}
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
    name?: string
    position: string
    definition: AjvSchema
    required?: string[]
  }) => {
    const isRequired = !!name && (required || []).includes(name)
    const items = useMemo(() => toArray((definition as AjvArraySchema).items), [
      definition,
    ])
    const oneOf = useMemo(() => (definition as AjvOperatorSchema).oneOf, [
      definition,
    ])
    const anyOf = useMemo(() => (definition as AjvOperatorSchema).anyOf, [
      definition,
    ])

    const obj = useMemo(() => {
      return (definition as AjvObjectSchema).type === 'object'
        ? (definition as AjvObjectSchema)
        : null
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
        {oneOf &&
          oneOf.map((item, i) => (
            <RequestTableRow key={i} position={position} definition={item} />
          ))}
        {anyOf &&
          anyOf.map((item, i) => (
            <RequestTableRow key={i} position={position} definition={item} />
          ))}
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
  name?: string
}) {
  return (
    <Table.Cell style={name ? {} : { borderTop: 0 }}>
      {name && (
        <span style={{ fontWeight: required ? 'bold' : 'normal' }}>
          <Code inline>{name}</Code>
        </span>
      )}
    </Table.Cell>
  )
})

const RequestTableTypeCell = React.memo(function ({
  definition,
}: {
  definition: AjvSchema
}) {
  let types: string[] = []

  if ((definition as AjvEnumSchema).enum) {
    types = [
      ...types,
      ...(definition as AjvEnumSchema).enum.map((value) =>
        JSON.stringify(value)
      ),
    ]
  }

  if ((definition as AjvNamedSchema).type) {
    const newTypes = toArray((definition as AjvNamedSchema).type).map(
      (type) => {
        if (type === 'string' && (definition as AjvStringSchema).format) {
          return (definition as AjvStringSchema).format!
        }

        return type
      }
    )

    types = [...types, ...newTypes]
  }

  return (
    <Table.Cell>
      {types.map((t, i) => (
        <>
          <Code key={i} inline>
            {t}
          </Code>{' '}
        </>
      ))}
    </Table.Cell>
  )
})

const restrictionProps = [
  'default',
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'multipleOf',
  'minLength',
  'maxLength',
  'pattern',
  'uniqueItems',
  'additionalItems',
  'unevaluatedItems',
  'minItems',
  'maxItems',
  'minContains',
  'maxContains',
  'additionalProperties',
]

const RequestTableDescriptionCell = React.memo(function ({
  required,
  definition,
}: {
  required: boolean
  definition: AjvSchema
}) {
  const restrictions: string[] = []

  if (required) {
    restrictions.push('required')
  }

  for (const prop of restrictionProps) {
    if (definition[prop] !== undefined) {
      restrictions.push(`${prop}: ${JSON.stringify(definition[prop])}`)
    }
  }

  return (
    <Table.Cell>
      <span>
        {(definition as AjvNamedSchema).description || ''}
        {restrictions.map((restriction) => (
          <>
            {' '}
            <Code inline>{restriction}</Code>
          </>
        ))}
      </span>
    </Table.Cell>
  )
})
