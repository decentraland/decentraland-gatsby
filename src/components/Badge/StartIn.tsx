import React from 'react'

import useCountdown from '../../hooks/useCountdown'
import useFormatMessage from '../../hooks/useFormatMessage'
import TokenList from '../../utils/dom/TokenList'
import Live from './Live'

import './StartIn.css'

export type StartInProps = {
  date: Date
}

export default function StartIn(props: StartInProps) {
  const countdown = useCountdown(props.date)
  const l = useFormatMessage()

  if (countdown.time <= 0) {
    return <Live primary />
  }

  const days = countdown.days
  const hours = countdown.hours
  const minutes = countdown.minutes

  return (
    <div className={TokenList.join(['StartIn'])}>
      {days > 0 &&
        `in ${days} ${
          days === 1
            ? l('components.badge.start_in.day')
            : l('components.badge.start_in.days')
        }`}
      {days === 0 &&
        hours > 0 &&
        `in ${hours} ${
          hours === 1
            ? l('components.badge.start_in.hour')
            : l('components.badge.start_in.hours')
        }`}
      {days === 0 &&
        hours === 0 &&
        minutes > 0 &&
        `in ${minutes + 1} ${
          minutes + 1 === 1
            ? l('components.badge.start_in.minute')
            : l('components.badge.start_in.minutes')
        }`}
      {days === 0 &&
        hours === 0 &&
        minutes === 0 &&
        l('components.badge.start_in.in_less_than_a_minute')}
    </div>
  )
}
