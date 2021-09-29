import React from 'react'
import Paragraph from '../Text/Paragraph'
import RequestTable, { RequestTableProps } from './RequestTable'
import SubTitle from '../Text/SubTitle'
import Blockquote from '../Text/Blockquote'

export type ApiDetailsProps = {
  title?: string
  description?: string
  deprecated?: boolean
  authorization?: 'required' | 'optional' | boolean
  cors?: 'site' | 'decentraland' | '*'
} & RequestTableProps

export default React.memo(function ApiDetails(props: ApiDetailsProps) {
  return (
    <>
      {props.title && <SubTitle>{props.title}</SubTitle>}
      {props.description && <Paragraph small>props.description</Paragraph>}
      {props.authorization && (
        <Blockquote>
          <Paragraph small>
            Authentication:{' '}
            {props.authorization === true ? 'required' : props.authorization}
          </Paragraph>
        </Blockquote>
      )}
      {props.cors && (
        <Blockquote>
          <Paragraph small>
            {'CORS: '}
            {props.cors === 'site' && 'Accessible only from this dApps'}
            {props.cors === 'decentraland' &&
              'Accessible from decentraland domains'}
            {props.cors === '*' && 'Publicly Accessible'}
          </Paragraph>
        </Blockquote>
      )}
      {props.deprecated && (
        <Blockquote danger>
          <Paragraph small>Deprecated</Paragraph>
        </Blockquote>
      )}
      <RequestTable
        query={props.query}
        body={props.body}
        header={props.header}
        params={props.params}
      />
    </>
  )
})
