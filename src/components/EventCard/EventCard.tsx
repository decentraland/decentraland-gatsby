import React, { useCallback } from 'react'

import { navigate } from '../../plugins/intl'
import EventCardBig from './Big/EventCardBig'
import EventCardDefault from './Default/EventCardDefault'
import EventCardMini from './Mini/EventCardMini'

export enum Frequency {
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY',
  HOURLY = 'HOURLY',
  MINUTELY = 'MINUTELY',
  SECONDLY = 'SECONDLY',
}

export enum Position {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5,
  LAST = -1,
}

export type EventAttributes = {
  id: string
  name: string
  image: string | null
  description: string
  start_at: Date
  finish_at: Date
  next_start_at: Date
  next_finish_at: Date
  duration: number
  all_day: boolean
  x: number
  y: number
  server: string | null
  url: string | null
  user: string
  estate_id: string | null
  estate_name: string | null
  user_name: string | null
  approved: boolean
  rejected: boolean
  highlighted: boolean
  trending: boolean
  created_at: Date
  updated_at: Date
  recurrent: boolean
  recurrent_frequency: Frequency | null
  recurrent_setpos: Position | null
  recurrent_monthday: number | null
  recurrent_weekday_mask: number
  recurrent_month_mask: number
  recurrent_interval: number
  recurrent_count: number | null
  recurrent_until: Date | null
  recurrent_dates: Date[]
  contact: string | null
  details: string | null
  total_attendees: number
  latest_attendees: string[]
  categories: string[]
  schedules: string[]
  approved_by: string | null
  rejected_by: string | null
  scene_name: string | null
  coordinates: [number, number]
  attending: boolean
  notify: boolean
  live: boolean
  position: [number, number]
}

export enum EventCardSize {
  MINI = 'mini',
  DEFAULT = 'default',
  BIG = 'big',
}

export type EventCardProps = {
  href?: string
  event?: EventAttributes
  loading?: boolean
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement>,
    data: EventAttributes
  ) => void
  onUpdateAttendee: (id: string, attending: boolean) => void
  onNotify: (id: string, attending: boolean) => void
  size?: EventCardSize
  localTimezone?: boolean
  children?: React.ReactNode
}

export default React.memo(function EventCard(props: EventCardProps) {
  const { event, onClick, href, size, children } = props

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (event) {
        if (onClick) {
          onClick(e, event)
        }

        if (!e.defaultPrevented && href) {
          navigate(href)
        }
      }
    },
    [event, onClick, href]
  )

  if (size && size === EventCardSize.MINI) {
    return <EventCardMini {...props} onClick={handleClick} />
  } else if (size && size === EventCardSize.BIG) {
    return <EventCardBig {...props} onClick={handleClick} children={children} />
  } else {
    return <EventCardDefault {...props} onClick={handleClick} />
  }
})
