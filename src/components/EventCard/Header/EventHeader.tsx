import React from 'react'

import useFormatMessage from '../../../hooks/useFormatMessage'
import Link from '../../../plugins/intl/Link'
import TokenList from '../../../utils/dom/TokenList'
import DateBox from '../../Date/DateBox'
import LoadingText from '../../Loading/LoadingText'
import Paragraph from '../../Text/Paragraph'
import SubTitle from '../../Text/SubTitle'
import { EventAttributes } from '../EventCard'

import './EventHeader.css'

export default React.memo(function EventHeader(props: {
  event?: EventAttributes
  loading?: boolean
  utc?: boolean
  children?: React.ReactNode
}) {
  const { event, utc, loading, children } = props

  const now = Date.now()
  const { next_start_at } = event || { next_start_at: new Date(now) }

  const l = useFormatMessage()

  return (
    <>
      {event && !loading && (
        <div className="event-header">
          <div className="event-header__wrapper">
            <DateBox date={next_start_at} utc={!!utc} />
            <div className="event-header__text-container">
              <SubTitle>{event.name}</SubTitle>
              <Paragraph className="event-header__event-by" secondary>
                {l('components.event_header.public_organized_by', {
                  organizer: <Link>{event.user_name || 'Guest'}</Link>,
                })}
              </Paragraph>
            </div>
          </div>
          {children && <div className="event-header__actions">{children}</div>}
        </div>
      )}
      {loading && (
        <div className="event-header">
          <DateBox date={next_start_at} utc={utc} />
          <div
            className={TokenList.join([
              'event-header__text-container',
              'loading',
            ])}
          >
            <LoadingText type="p" size="full" />
            <Paragraph className="event-header__event-by" secondary>
              <LoadingText type="span" size="small" />
              <LoadingText type="span" size="small" />
            </Paragraph>
          </div>
        </div>
      )}
    </>
  )
})
