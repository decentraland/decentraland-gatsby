import React, { useMemo } from 'react'

import Time from '../../utils/date/Time'

import './DateBox.css'

export type DateBoxProps = {
  date: Date
  utc?: boolean
}

export default React.memo(function DateBox(props: DateBoxProps) {
  const now = useMemo(() => Time.from(new Date(), { utc: props.utc }), [])
  const date = useMemo(
    () => Time.from(props.date, { utc: props.utc }),
    [props.date.getTime(), props.utc]
  )

  return (
    <div className="DateBox">
      <div className="DateBox__Month">{date.format('MMM')}</div>
      <div className="DateBox__Day">{date.format('DD')}</div>
      {now.year() !== date.year() && (
        <div className="DateBox__Year">{date.format('YYYY')}</div>
      )}
    </div>
  )
})
