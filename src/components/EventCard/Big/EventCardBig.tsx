import React from 'react'

import { Card } from 'decentraland-ui/dist/components/Card/Card'

import TokenList from '../../../utils/dom/TokenList'
import ImgFixed from '../../Image/ImgFixed'
import { EventCardProps } from '../EventCard'

import './EventCardBig.css'

export type EventCardBigProps = EventCardProps & {
  children: React.ReactNode
}

export default React.memo(function EventCardBig(props: EventCardBigProps) {
  const { event, href, onClick, children } = props

  return (
    <Card
      className={TokenList.join([
        'event-card--big',
        props.loading && 'loading',
        event && !event.approved && 'pending',
      ])}
      href={href}
      onClick={onClick}
    >
      <div className="event-card--big__container">
        <div className="event-card--big__cover">
          <ImgFixed src={event?.image || ''} dimension="wide" />
        </div>
        <Card.Content>{event && children}</Card.Content>
      </div>
    </Card>
  )
})
