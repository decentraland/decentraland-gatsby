import React, { useMemo } from 'react'

import useFormatMessage from '../../../hooks/useFormatMessage'
import Time from '../../../utils/date/Time'
import TokenList from '../../../utils/dom/TokenList'
import { EventAttributes } from '../EventCard'

import './EventDate.css'

export type EventDateProps = React.HTMLProps<HTMLDivElement> & {
  event: EventAttributes
  utc?: boolean
}

export default React.memo(function EventDate({
  event,
  utc,
  ...props
}: EventDateProps) {
  const l = useFormatMessage()
  const now = useMemo(() => Time.from(Date.now(), { utc: !!utc }), [utc])
  const start_at = useMemo(
    () =>
      Time.from(event.next_start_at || now, {
        utc: !!utc,
      }),
    [event.next_start_at, utc]
  )

  const finish_at = useMemo(
    () =>
      Time.from(start_at.getTime() + event.duration, {
        utc: !!utc,
      }),
    [start_at, event.duration, utc]
  )

  const description = useMemo(() => {
    if (now.isBetween(start_at, finish_at)) {
      return l('components.event_card.event_date.now')
    }

    if (start_at.isToday()) {
      return l('components.event_card.event_date.today')
    }

    if (start_at.isTomorrow()) {
      return l('components.event_card.event_date.tomorrow')
    }

    return start_at.format(`MMMM DD`)
  }, [start_at, finish_at])

  return (
    <div {...props} className={TokenList.join(['event-date', props.className])}>
      {description}
    </div>
  )
})
