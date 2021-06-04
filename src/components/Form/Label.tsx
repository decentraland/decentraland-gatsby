import React from 'react'
import TokenList from '../../utils/dom/TokenList'
import './Label.css'

export type LabelProps = React.HTMLProps<HTMLLabelElement>

export default function Label(props: LabelProps) {
  return (
    <label {...props} className={TokenList.join(['Label', props.className])} />
  )
}
