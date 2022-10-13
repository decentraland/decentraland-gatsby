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
}

export default React.memo(function InputDate(props: InputDateProps) {
  const initialValue = useMemo(
    () => toInputDateValue(props.initialValue),
    [props.initialValue]
  )
  const value = useMemo(() => toInputDateValue(props.value), [props.value])
  const handleChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      data: InputBaseOnChangeData
    ) => {
      if (props.onChange) {
        const value = fromInputDateValue(data.value)
        props.onChange(event, { ...props, value })
      }
    },
    [props.onChange]
  )

  return (
    <InputBase
      {...omit(props, ['initialValue'])}
      value={value}
      defaultValue={initialValue}
      type="date"
      onChange={handleChange}
      action={props.action}
    />
  )
})

export function toInputDateValue(value?: Date | Time.Dayjs | number) {
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

  return Time.from(value).format(Time.Formats.InputDate)
}

export function fromInputDateValue(value: string | undefined) {
  if (!value) {
    return undefined
  }

  const result = Time.from(value, {
    format: Time.Formats.InputDate,
  }).toDate()

  if (!Number.isFinite(result.getTime())) {
    return undefined
  }

  return result
}
