import React from 'react'
import { toMonthName, toDayNumber } from './utils'

import './DateBox.css'

export type DateBoxProps = {
  date: Date
}

export default function DateBox(props: DateBoxProps) {
  return <div className="DateBox">
    <div className="DateBox__Month">{toMonthName(props.date, { short: true, utc: true })}</div>
    <div className="DateBox__Day">{toDayNumber(props.date, { utc: true })}</div>
  </div>
}