import React, { useCallback, useMemo } from 'react'

import omit from 'lodash/omit'
import InputBase, {
  InputOnChangeData as InputBaseOnChangeData,
  InputProps as InputBaseProps,
} from 'semantic-ui-react/dist/commonjs/elements/Input'

import Time from '../../utils/date/Time'
import mod from '../../utils/number/mod'

import './Input.css'

export type InputTimeProps = Omit<InputBaseProps, 'type' | 'defaultValue'> & {
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputTimeProps
  ) => void
  initialValue?: number
  value?: number
}

export default React.memo(function InputTime(props: InputTimeProps) {
  const initialValue = useMemo(
    () => toInputTimeValue(props.initialValue),
    [props.initialValue]
  )
  const value = useMemo(() => toInputTimeValue(props.value), [props.value])
  const handleChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      data: InputBaseOnChangeData
    ) => {
      if (props.onChange) {
        const value = fromInputTimeValue(data.value)
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
      type="time"
      onChange={handleChange}
    />
  )
})

export function toInputTimeValue(value?: number) {
  if (value === undefined || value === null) {
    return undefined
  }

  return Time.duration(mod(value, Time.Day)).format(Time.Formats.InputTime)
}

export function fromInputTimeValue(value: string | undefined) {
  if (!value) {
    return undefined
  }

  const [hours, minutes] = value.split(':').map(Number)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return undefined
  }

  const result = hours * Time.Hour + minutes * Time.Minute
  return Math.min(Math.max(result, 0), Time.Day - 1)
}
