import React, { useCallback, useMemo } from 'react'

import { Card } from 'decentraland-ui/dist/components/Card/Card'

import TokenList from '../../../utils/dom/TokenList'
import StartIn from '../../Badge/StartIn'
import Attending from '../../Button/Attending'
import JumpInPosition from '../../Button/JumpInPosition'
import ImgFixed from '../../Image/ImgFixed'
import LoadingText from '../../Loading/LoadingText'
import Avatar from '../../Profile/Avatar'
import EventDate from '../Date/EventDate'
import { EventCardProps } from '../EventCard'

import './EventCardDefault.css'

const EVENTS_LIST = 3

export default React.memo(function EventCardDefault(props: EventCardProps) {
  const { event, onClick, href, localTimezone, loading } = props

  const nextStartAt = useMemo(
    () =>
      new Date(event ? Date.parse(event.next_start_at.toString()) : Date.now()),
    [event?.next_start_at]
  )
  const handleJumpIn = useCallback(
    (e: React.MouseEvent<any>) => e.preventDefault(),
    []
  )

  return (
    <Card
      link
      className={TokenList.join([
        'event-card',
        loading && 'loading',
        event && !event.approved && 'pending',
      ])}
      href={href}
      onClick={onClick}
    >
      {event && !loading && <StartIn date={nextStartAt} />}
      <div className="event-card__cover">
        {event && !loading && event.total_attendees > 0 && (
          <div className="event-card__attendees">
            {event.latest_attendees.slice(0, EVENTS_LIST).map((address) => (
              <Avatar size="mini" key={address} address={address} />
            ))}
            {event.total_attendees > EVENTS_LIST && (
              <div className="event-card__attendees-more">
                <div>+{Math.max(event.total_attendees - EVENTS_LIST, 0)}</div>
              </div>
            )}
          </div>
        )}
        <ImgFixed src={event?.image || ''} dimension="wide" />
      </div>
      <Card.Content>
        {!loading && (
          <>
            {event && (
              <div className="event-card__content-header">
                <EventDate event={event} utc={!localTimezone} />
                <div>
                  <JumpInPosition event={event} onClick={handleJumpIn} />
                </div>
              </div>
            )}

            <Card.Header>{event?.name || ' '}</Card.Header>
          </>
        )}
        {loading && (
          <>
            <div className="event-card__content-header">
              <LoadingText type="span" size="small" />
              <LoadingText type="span" size="medium" />
            </div>
            <LoadingText type="h3" size="large" />
          </>
        )}
        <Card.Description>
          <Attending {...props} />
        </Card.Description>
      </Card.Content>
    </Card>
  )
})
