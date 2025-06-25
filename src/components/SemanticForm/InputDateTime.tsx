import React, { useCallback, useMemo, useState } from 'react'

import omit from 'lodash/omit'
import Button from 'semantic-ui-react/dist/commonjs/elements/Button'
import InputBase, {
  InputOnChangeData as InputBaseOnChangeData,
  InputProps as InputBaseProps,
} from 'semantic-ui-react/dist/commonjs/elements/Input'

import Time from '../../utils/date/Time'
import { fromInputDateValue } from './InputDate'

import './Input.css'

export type InputDateTimeProps = Omit<
  InputBaseProps,
  'type' | 'defaultValue'
> & {
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputDateTimeProps
  ) => void
  initialValue?: Date | Time.Dayjs | number
  value?: Date | Time.Dayjs | number
  utc?: boolean
}

export default React.memo(function InputDateTime(props: InputDateTimeProps) {
  const [utc, setUTC] = useState(props.utc)
  const [initialDateValue, initialTimeValue] = useMemo(
    () => toInputDateTimeValues(props.initialValue, utc),
    [props.initialValue, utc]
  )
  const [dateValue, timeValue] = useMemo(
    () => toInputDateTimeValues(props.value, utc),
    [props.value, utc]
  )
  const handleChangeUTC = useCallback(() => setUTC((prev) => !prev), [])
  const handleChangeDate = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      data: InputBaseOnChangeData
    ) => {
      if (props.onChange) {
        const value = fromInputDateValue(data.value, utc)
        props.onChange(event, { ...props, value })
      }
    },
    [props.onChange, utc]
  )

  const handleChangeTime = useCallback(() => {}, [])

  console.log('initialValue', [initialDateValue, initialTimeValue])
  console.log('value', [dateValue, timeValue])

  return (
    <InputBase
      {...omit(props, ['utc', 'initialValue'])}
      value={dateValue}
      defaultValue={initialDateValue}
      type="date"
      onChange={handleChangeDate}
      action={props.action || utc !== undefined}
    >
      <input />
      <InputBase
        {...omit(props, ['utc', 'initialValue'])}
        value={timeValue}
        defaultValue={initialTimeValue}
        type="time"
        onChange={handleChangeTime}
      />
      {utc !== undefined && (
        <Button
          labelPosition="right"
          icon={utc ? 'check' : 'time'}
          positive={utc}
          content={utc ? 'UTC' : 'Local'}
          onClick={handleChangeUTC}
        />
      )}
    </InputBase>
  )
})

export function toInputDateTimeValues(
  value?: Date | Time.Dayjs | number,
  utc?: boolean
) {
  if (value === undefined || value === null) {
    return [undefined, undefined] as const
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return [undefined, undefined] as const
    }

    if (value < 0) {
      value = 0
    }
  }

  const datetime = Time.from(value, { utc })
  const date = datetime.format(Time.Formats.InputDate)
  const time = Time.duration(
    datetime.diff(Time.from(datetime, { utc }).startOf('day'))
  ).format(Time.Formats.InputTime)

  return [date, time] as const
}

export function fromInputDateTimeValues(
  value: string | undefined,
  utc?: boolean
) {
  if (!value) {
    return undefined
  }

  const result = Time.from(value, {
    utc,
    format: Time.Formats.InputDate,
  }).toDate()

  if (!Number.isFinite(result.getTime())) {
    return undefined
  }

  return result
}
