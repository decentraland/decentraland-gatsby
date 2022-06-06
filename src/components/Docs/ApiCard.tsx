import { Card } from 'decentraland-ui/dist/components/Card/Card'
import { Header } from 'decentraland-ui/dist/components/Header/Header'
import { Stats } from 'decentraland-ui/dist/components/Stats/Stats'
import React, { memo } from 'react'

import Accordion from '../Accordion/Accordion'
import Code from '../Text/Code'
import Paragraph from '../Text/Paragraph'
import MethodLabel from './MethodLabel'

import './ApiCard.css'

export type ApiCardProps = {
  id?: string
  method?:
    | 'GET'
    | 'OPTIONS'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | string
  path?: string
  description?: string
  deprecated?: boolean
  children?: React.ReactNode
}

export default memo(function ApiCard(props: ApiCardProps) {
  return (
    <Card className="ApiCard">
      <Card.Content>
        <Accordion
          id={props.id}
          title={
            <Stats title={(<MethodLabel method={props.method} />) as any}>
              <Header>
                <Code inline>{props.path || ''}</Code>
                {props.deprecated && ' (deprecated)'}
              </Header>
            </Stats>
          }
          description={
            <Paragraph secondary small>
              {props.description}
            </Paragraph>
          }
        >
          {props.children}
        </Accordion>
      </Card.Content>
    </Card>
  )
})
