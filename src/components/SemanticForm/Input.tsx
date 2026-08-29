import React from 'react'

import InputBase, {
  InputProps as InputBaseProps,
} from 'semantic-ui-react/dist/commonjs/elements/Input'

import InputDate, { InputDateProps } from './InputDate'
import InputDateTime, { InputDateTimeProps } from './InputDateTime'
import InputTime, { InputTimeProps } from './InputTime'

import './Input.css'

export type InputProps =
  | InputTimeProps
  | InputDateProps
  | InputDateTimeProps
  | InputBaseProps

export default React.memo(function Input(props: InputProps) {
  switch (props.type) {
    case 'time':
      return <InputTime {...(props as InputTimeProps)} />
    case 'date':
      return <InputDate {...(props as InputDateProps)} />
    case 'datetime':
      return <InputDateTime {...(props as InputDateProps)} />
    default:
      return <InputBase {...(props as InputBaseProps)} />
  }
})
