import React from 'react'
import { Card } from 'decentraland-ui/dist/components/Card/Card'
import { Stats } from 'decentraland-ui/dist/components/Stats/Stats'
import { Header } from 'decentraland-ui/dist/components/Header/Header'
import Accordion from '../Accordion/Accordion'
import Code from '../Text/Code'
import Paragraph from '../Text/Paragraph'

export type ApiCardProps = {
  id?: string
  method?: 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path?: string
  description?: string
  children?: React.ReactNode
}

export default React.memo(function ApiCard(props: ApiCardProps) {
  return (
    <Card style={{ width: '100%' }}>
      <Card.Content>
        <Accordion
          id={props.id}
          title={
            <Stats title={props.method || ''}>
              <Header>
                <Code inline>{props.path || ''}</Code>
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
