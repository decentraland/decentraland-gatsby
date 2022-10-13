import React, { useCallback, useMemo, useState } from 'react'

import omit from 'lodash/omit'
import Button from 'semantic-ui-react/dist/commonjs/elements/Button'
import InputBase, {
  InputOnChangeData as InputBaseOnChangeData,
  InputProps as InputBaseProps,
} from 'semantic-ui-react/dist/commonjs/elements/Input'

import Time from '../../utils/date/Time'

import './Input.css'

export type InputDateProps = Omit<InputBaseProps, 'type' | 'defaultValue'> & {
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputDateProps
  ) => void
  initialValue?: Date | Time.Dayjs | number
  value?: Date | Time.Dayjs | number
  utc?: boolean
}

export default React.memo(function InputDate(props: InputDateProps) {
  const [utc, setUTC] = useState(props.utc)
  const initialValue = useMemo(
    () => toInputDateValue(props.initialValue, utc),
    [props.initialValue, utc]
  )
  const value = useMemo(
    () => toInputDateValue(props.value, utc),
    [props.value, utc]
  )
  const handleChangeUTC = useCallback(() => setUTC((prev) => !prev), [])
  const handleChange = useCallback(
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

  return (
    <InputBase
      {...omit(props, ['utc', 'initialValue'])}
      value={value}
      defaultValue={initialValue}
      type="date"
      onChange={handleChange}
      action={props.action || utc !== undefined}
    >
      <input />
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

export function toInputDateValue(
  value?: Date | Time.Dayjs | number,
  utc?: boolean
) {
  if (value === undefined || value === null) {
    return undefined
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return undefined
    }

    if (value < 0) {
      value = 0
    }
  }

  return Time.from(value, { utc }).format(Time.Formats.InputDate)
}

export function fromInputDateValue(value: string | undefined, utc?: boolean) {
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
