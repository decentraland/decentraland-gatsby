import React, { useMemo } from 'react'

import { Header } from 'decentraland-ui/dist/components/Header/Header'
import { Table } from 'decentraland-ui/dist/components/Table/Table'

import { toArray } from './utils'
import Code from '../Text/Code'
import Paragraph from '../Text/Paragraph'

import type {
  AjvArraySchema,
  AjvEnumSchema,
  AjvNamedSchema,
  AjvObjectSchema,
  AjvOperatorSchema,
  AjvSchema,
  AjvStringSchema,
} from '../../entities/Schema/types'

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
    <Table className="RequestTable">
      <Table.Body>
        {header && header.properties && (
          <Table.Row>
            <Table.Cell colspan="3" className="RequestTable__Section">
              <Header sub>Header</Header>
              {header.description && (
                <Paragraph small secondary>
                  {header.description}
                </Paragraph>
              )}
            </Table.Cell>
          </Table.Row>
        )}
        {Object.keys(header?.properties || {}).map((key) => {
          if (!header || !header.properties || !header.properties[key]) {
            return <React.Fragment key={`header::${key}`} />
          }
          return (
            <RequestTableRow
              key={`header::${key}`}
              name={key}
              definition={header.properties[key]}
              required={header?.required}
            />
          )
        })}
        {params && params.properties && (
          <Table.Row>
            <Table.Cell colspan="3" className="RequestTable__Section">
              <Header sub>URL</Header>
              {params.description && (
                <Paragraph small secondary>
                  {params.description}
                </Paragraph>
              )}
            </Table.Cell>
          </Table.Row>
        )}
        {Object.keys(params?.properties || {}).map((key) => {
          if (!params || !params.properties || !params.properties[key]) {
            return <React.Fragment key={`header::${key}`} />
          }
          return (
            <RequestTableRow
              key={`param::${key}`}
              name={key}
              definition={params.properties[key]}
              required={params?.required}
            />
          )
        })}
        {query && query.properties && (
          <Table.Row>
            <Table.Cell colspan="3" className="RequestTable__Section">
              <Header sub>Query params</Header>
              {query.description && (
                <Paragraph small secondary>
                  {query.description}
                </Paragraph>
              )}
            </Table.Cell>
          </Table.Row>
        )}
        {Object.keys(query?.properties || {}).map((key) => {
          if (!query || !query.properties || !query.properties[key]) {
            return <React.Fragment key={`header::${key}`} />
          }
          return (
            <RequestTableRow
              key={`query::${key}`}
              name={key}
              definition={query.properties[key]}
              required={query?.required}
            />
          )
        })}
        {body && body.properties && (
          <Table.Row>
            <Table.Cell colspan="3" className="RequestTable__Section">
              <Header sub>Body</Header>
              {body.description && (
                <Paragraph small secondary>
                  {body.description}
                </Paragraph>
              )}
            </Table.Cell>
          </Table.Row>
        )}
        {Object.keys(body?.properties || {}).map((key) => {
          if (!body || !body.properties || !body.properties[key]) {
            return <React.Fragment key={`header::${key}`} />
          }
          return (
            <RequestTableRow
              key={`body::${key}`}
              name={key}
              definition={body.properties[key]}
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
    definition,
    required,
  }: {
    name?: string
    definition: AjvSchema
    required?: string[] | readonly string[]
  }) => {
    const isRequired = !!name && (required || []).includes(name)
    const items = useMemo(
      () => toArray((definition as AjvArraySchema).items),
      [definition]
    )
    const oneOf = useMemo(
      () => (definition as AjvOperatorSchema).oneOf,
      [definition]
    )
    const anyOf = useMemo(
      () => (definition as AjvOperatorSchema).anyOf,
      [definition]
    )

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
          <RequestTableDescriptionCell
            required={isRequired}
            definition={definition}
          />
        </Table.Row>
        {oneOf &&
          oneOf.map((item, i) => <RequestTableRow key={i} definition={item} />)}
        {anyOf &&
          anyOf.map((item, i) => <RequestTableRow key={i} definition={item} />)}
        {items.map((item, i) => (
          <RequestTableRow key={i} name={`${name}[]`} definition={item} />
        ))}
        {Object.keys(obj?.properties || {}).map((key) => {
          if (!obj || !obj.properties || !obj.properties[key]) {
            return <React.Fragment key={`header::${key}`} />
          }
          return (
            <RequestTableRow
              key={key}
              name={`${name}.${key}`}
              definition={obj.properties[key]}
              required={obj.required}
            />
          )
        })}
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
        const stringDefinition = (definition as AjvStringSchema).format
        if (type === 'string' && stringDefinition) {
          return stringDefinition
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
] as (keyof AjvSchema)[]

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
