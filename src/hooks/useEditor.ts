import { useState } from 'react'
import omit from 'lodash.omit'

export type Editor<P extends {} = {}> = (state: P, newProps: Partial<P>) => P
export type Validator<P extends {} = {}> = (state: P, props: (keyof P | '*')[]) => Record<keyof P, string>

type EditorState<P extends {} = {}> = {
  value: P,
  error: Partial<Record<keyof P, string>>,
  validated: boolean
}

export default function useEditor<P extends {} = {}>(
  editor: Editor<P>,
  validator: Validator<P>,
  initialState: P
) {

  const [ state, setState ] = useState<EditorState<P>>({ value: initialState, error: {}, validated: false })
  function set(newProps: Partial<P>) {
    const value = editor(state.value, newProps)
    if (state.value !== value) {
      const keys = Object.keys(newProps) as (keyof P)[]
      const error = {
        ...omit(state.error, keys),
        ...validator(value, keys),
      }
      setState({ value, error, validated: false })
    }
  }

  function validate() {
    const keys = Object.keys(state.value) as (keyof P | '*')[]
    keys.push('*')

    const error = validator(state.value, keys)
    if (Object.keys(error).length === 0) {
      setState({ value: state.value, error, validated: true })
    } else {
      setState({ value: state.value, error, validated: false })
    }
  }

  function error(err: Partial<Record<keyof P | '*', string>>) {
    if (Object.keys(err).length > 0) {
      setState({ value: state.value, error: { ...state.error, ...err }, validated: false})
    }
  }

  return [ state, { set, validate, error } ]
}
