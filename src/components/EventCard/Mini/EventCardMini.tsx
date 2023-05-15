import React, { useCallback } from 'react'

import { Card } from 'decentraland-ui/dist/components/Card/Card'

import TokenList from '../../../utils/dom/TokenList'
import JumpInPosition from '../../Button/JumpInPosition'
import ImgFixed from '../../Image/ImgFixed'
import LoadingText from '../../Loading/LoadingText'
import EventDate from '../Date/EventDate'
import { EventCardProps } from '../EventCard'

import './EventCardMini.css'

export type EventCardMiniProps = EventCardProps

export default React.memo(function EventCardMini(props: EventCardMiniProps) {
  const { event, onClick, href, localTimezone, loading } = props

  const handleJumpIn = useCallback(
    (e: React.MouseEvent<any>) => e.stopPropagation(),
    []
  )

  return (
    <Card
      className={TokenList.join([
        'event-card--mini',
        loading && 'loading',
        event && !event.approved && 'pending',
      ])}
      href={href}
      onClick={onClick}
    >
      {event && !loading && (
        <JumpInPosition event={event} compact onClick={handleJumpIn} />
      )}
      <div style={{ display: 'flex' }}>
        <div className="event-card--mini__cover">
          <ImgFixed src={event?.image || ''} dimension="square" />
          {event && !loading && (
            <div className="event-card--mini__attendees">
              <div className="event-card--mini__attendees-more">
                +{event.total_attendees}
              </div>
            </div>
          )}
        </div>
        <Card.Content>
          {event && !loading && (
            <>
              <EventDate event={event} utc={!localTimezone} />
              <Card.Header>{event?.name || ' '}</Card.Header>
            </>
          )}
          {loading && (
            <>
              <div className="event-card--mini__content-header">
                <LoadingText type="span" size="small" />
                <LoadingText type="span" size="medium" />
              </div>
              <LoadingText type="h3" size="large" lines={2} />
            </>
          )}
        </Card.Content>
      </div>
    </Card>
  )
})
