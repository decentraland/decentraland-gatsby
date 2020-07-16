import React, { useMemo } from 'react'
import Datetime from '../../utils/Datetime'

import './DateBox.css'

export type DateBoxProps = {
  date: Date
  utc?: boolean
}

export default function DateBox(props: DateBoxProps) {
  const date = useMemo(() => Datetime.from(props.date, { utc: props.utc }), [props.date.getTime(), props.utc])

  return <div className="DateBox">
    <div className="DateBox__Month">{date.getMonthName({ short: true })}</div>
    <div className="DateBox__Day">{date.getDatePadded()}</div>
  </div>
}