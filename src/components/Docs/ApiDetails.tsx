import React from 'react'
import Paragraph from '../Text/Paragraph'
import RequestTable, { RequestTableProps } from './RequestTable'
import SubTitle from '../Text/SubTitle'
import Blockquote from '../Text/Blockquote'

export type ApiDetailsProps = {
  title?: string
  description?: string
  authorization?: boolean
} & RequestTableProps

export default React.memo(function ApiDetails(props: ApiDetailsProps) {
  return (
    <>
      {props.title && <SubTitle>{props.title}</SubTitle>}
      {props.description && <Paragraph small>props.description</Paragraph>}
      {props.authorization && (
        <Blockquote>
          <Paragraph small>Authentication is required</Paragraph>
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
